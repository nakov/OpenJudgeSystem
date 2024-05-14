namespace OJS.Servers.Administration.Filters;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using OJS.Common.Extensions;
using OJS.Servers.Administration.Attributes;
using OJS.Servers.Administration.Controllers.Api;
using OJS.Services.Administration.Business;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure.Extensions;
using OJS.Data.Models.Common;
using System;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using static OJS.Services.Administration.Models.AdministrationConstants.AdministrationOperations;

/// <summary>
/// <para>
/// Filter that validates permissions of current user on an entity level.
/// If the user does not have permissions for the action, Unauthorized result with a message is returned immediately.
/// </para>
/// <para>
/// The filter operates with conjunction with the <see cref="ProtectedEntityActionAttribute"/>.
/// It is used to mark the protected Actions.
/// </para>
/// <para>
/// If the Action does not accept any arguments or is marked as unprotected explicitly, no validation is performed.
/// </para>
/// <para>
/// If the Action is marked as protected, the filter will validate the permissions of the user
/// against the provided entity instance, using a specific permissions service.
/// The permissions service is provided as a type in the attribute, or dynamically constructed from
/// the controller's TEntity type and the action's argument for validation type.
/// </para>
/// </summary>
public class EntityPermissionsFilter : IAsyncActionFilter
{
    private readonly IServiceProvider serviceProvider;

    public EntityPermissionsFilter(IServiceProvider serviceProvider)
        => this.serviceProvider = serviceProvider;

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (ShouldValidatePermissions(context, out var result))
        {
            var (valueToValidate, protectionAttribute) = result;
            var operation = protectionAttribute.Operation;
            var user = context.HttpContext.User.Map<UserInfoModel>();
            var permissionsServiceType = GetPermissionsServiceType(context, valueToValidate.GetType(), protectionAttribute);

            var (userHasEntityPermissions, message) =
                await this.UserHasPermissions(user, operation, valueToValidate, permissionsServiceType);

            if (!userHasEntityPermissions)
            {
                context.Result = new UnauthorizedObjectResult(
                    message ??
                    $"You are not authorized to perform \"{operation}\" operation on this entity instance.");
                return;
            }
        }

        await next();
    }

    /// <summary>
    /// Method to determine if the permissions should be validated for the current action.
    /// Permissions are validated only for actions accepting arguments, that are marked with the <see cref="ProtectedEntityActionAttribute"/>.
    /// If Action accepts argument and is not marked with the attribute, an exception is thrown.
    /// </summary>
    /// <param name="context">Action context.</param>
    /// <param name="result">The value to validate against with the protection attribute.</param>
    /// <returns>
    /// True if the permissions should be validated for the current action.
    /// </returns>
    /// <exception cref="InvalidOperationException">
    /// If the filter is used on a non-generic BaseAdminApiController.
    /// </exception>
    /// <exception cref="ArgumentException">
    /// When the provided parameters to the <see cref="ProtectedEntityActionAttribute"/>
    /// are invalid or do not match the expected types.
    /// </exception>
    private static bool ShouldValidatePermissions(
        ActionExecutingContext context,
        out (object value, ProtectedEntityActionAttribute protectionAttrbite) result)
    {
        result = (null!, null!);
        if (!context.ActionArguments.Any())
        {
            // No need to run permission checks, when no arguments are passed to action.
            return false;
        }

        var controllerBaseType = context.Controller.GetType().BaseType;
        if (controllerBaseType == null ||
            !controllerBaseType.IsGenericType ||
            controllerBaseType.GetGenericTypeDefinition() != typeof(BaseAdminApiController<,,,>))
        {
            throw new InvalidOperationException("Filter should be used only on Generic BaseAdminApiController.");
        }

        if (context.ActionDescriptor is not ControllerActionDescriptor descriptor)
        {
            // No controller action is called.
            return false;
        }

        var protectionAttribute = descriptor.MethodInfo.GetCustomAttribute<ProtectedEntityActionAttribute>(true);
        if (protectionAttribute == null)
        {
            throw new InvalidOperationException(
                $"Action {context.ActionDescriptor.DisplayName}, accepting arguments, " +
                $"is not marked with the {nameof(ProtectedEntityActionAttribute)}.");
        }

        if (protectionAttribute.Operation == Unrestricted)
        {
            return false;
        }

        // Get the argument that will be used for permissions check.
        if (context.ActionArguments.Count > 1 && string.IsNullOrEmpty(protectionAttribute.ArgumentName))
        {
            throw new ArgumentException(
                $"Action {context.ActionDescriptor.DisplayName} has more than one argument and " +
                $"no argument name is provided in the {nameof(ProtectedEntityActionAttribute)}.");
        }

        var argument = string.IsNullOrEmpty(protectionAttribute.ArgumentName)
            ? context.ActionArguments.First()
            : context.ActionArguments.FirstOrDefault(a => a.Key == protectionAttribute.ArgumentName);

        if (string.IsNullOrEmpty(argument.Key))
        {
            throw new ArgumentException(
                $"Action {context.ActionDescriptor.DisplayName} does not have an argument with name " +
                $"{protectionAttribute.ArgumentName} and entity permission check could not be initiated.");
        }

        if (argument.Value == null)
        {
            // No need to run permission checks, when passed value is null, as it is not a valid entity instance.
            return false;
        }

        result = (argument.Value, protectionAttribute);
        return true;
    }

    private static Type GetPermissionsServiceType(
        ActionExecutingContext context,
        Type valueToValidateType,
        ProtectedEntityActionAttribute protectionAttribute)
    {
        var permissionsServiceInterfaceType = typeof(IEntityPermissionsService<,>);
        Type? entityType;
        if (protectionAttribute.PermissionsServiceType != null)
        {
            if (!protectionAttribute.PermissionsServiceType.IsAssignableToGenericType(permissionsServiceInterfaceType))
            {
                throw new ArgumentException(
                    $"The provided permissions service to the {nameof(ProtectedEntityActionAttribute)} must " +
                    $"be assignable to type {nameof(IEntityPermissionsService<IEntity, object>)}");
            }

            var interfaceType =
                protectionAttribute.PermissionsServiceType.GetGenericInterfaceType(permissionsServiceInterfaceType)!;

            var serviceArguments = interfaceType.GetGenericArguments();
            if (serviceArguments.Length < 2)
            {
                throw new ArgumentException(
                    $"Generic arguments of interface {interfaceType.Name} should be at least 2." +
                    $"First for entity type, second for value (validate against) type");
            }

            entityType = serviceArguments[0];
            var serviceArgumentType = serviceArguments[1];
            if (serviceArgumentType != valueToValidateType)
            {
                throw new ArgumentException(
                    $"Type of the Action argument does not match with the TInput type of the provided permissions service." +
                    $"Action argument is {valueToValidateType}, service expects {serviceArgumentType}");
            }
        }
        else
        {
            // Get the default entity type from the controller.
            entityType = context.Controller.GetType().BaseType?.GetGenericArguments().FirstOrDefault();
        }

        if (entityType == null)
        {
            throw new InvalidOperationException(
                $"Could not resolve entity type for the {nameof(ProtectedEntityActionAttribute)}" +
                $"on Action {context.ActionDescriptor.DisplayName}.");
        }

        return permissionsServiceInterfaceType.MakeGenericType(entityType, valueToValidateType);
    }

    /// <summary>
    /// Method to determine if the user has permissions for some action on an entity, given an input.
    /// It will use an instance of a specific entity permissions service,
    /// that will validate the user permissions against the provided input and return true or false.
    /// </summary>
    /// <returns>
    /// True if the given user has permissions for the given action on the given entity,
    /// validated against the given input. Otherwise False and possibly a message with explanation.
    /// </returns>
    /// <exception cref="InvalidOperationException">
    /// When IEntityPermissionsService does not return expected Task with boolean result.
    /// </exception>
    private async Task<(bool, string? message)> UserHasPermissions(
        UserInfoModel user,
        string operation,
        object value,
        Type permissionsServiceType)
    {
        if (operation == Unrestricted)
        {
            return (true, null);
        }

        var permissionsServiceInstance = this.serviceProvider.GetService(permissionsServiceType);
        if (permissionsServiceInstance == null)
        {
            // Forbid any action, when no service is implemented for the given input.
            return (false,
                $"Action \"{operation}\" is forbidden for user." +
                $"Could not resolve service of type {permissionsServiceType.FullName}");
        }

        const string methodName = nameof(IEntityPermissionsService<IEntity, object>.HasPermission);
        var permissionsServiceInstanceType = permissionsServiceInstance.GetType();
        var method = permissionsServiceInstanceType.GetMethod(methodName, BindingFlags.Instance | BindingFlags.Public);
        if (method == null)
        {
            throw new InvalidOperationException(
                $"Method {methodName} could not be found on the provided entity permissions service.");
        }

        var task = method.Invoke(permissionsServiceInstance, new[] { user, value, operation });
        if (task is not Task<bool> resultTask)
        {
            throw new InvalidOperationException(
                $"{methodName} method on the {permissionsServiceInstanceType.FullName} service should return Task<bool>.");
        }

        var result = await resultTask;
        return (result, null);
    }
}