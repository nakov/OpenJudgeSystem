namespace OJS.Servers.Administration.Filters;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using OJS.Common.Extensions;
using OJS.Servers.Administration.Attributes;
using OJS.Servers.Administration.Controllers.Api;
using OJS.Services.Administration.Business;
using OJS.Services.Common.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using SoftUni.Data.Infrastructure.Models;
using System;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using static OJS.Services.Administration.Models.AdministrationConstants.AdministrationActions;

/// <summary>
/// Filter that validates permissions of current user on an entity level.
/// Every Action, part of the base administration api controller, accepting a parameter, is validated automatically.
/// If the user does not have permissions for the action, Unauthorized result with a message is returned immediately.
/// </summary>
public class EntityPermissionsFilter : IAsyncActionFilter
{
    private readonly IServiceProvider serviceProvider;

    public EntityPermissionsFilter(IServiceProvider serviceProvider)
        => this.serviceProvider = serviceProvider;

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (ShouldValidatePermissions(context, out var permissionsModel))
        {
            var user = context.HttpContext.User.Map<UserInfoModel>();
            var (userHasEntityPermissions, message) = await this.UserHasPermissions(user, permissionsModel);

            if (!userHasEntityPermissions)
            {
                context.Result = new UnauthorizedObjectResult(
                    message ??
                    $"You are not authorized to perform \"{permissionsModel.Action}\" action on this entity instance.");
                return;
            }
        }

        await next();
    }

    private static bool ShouldValidatePermissions(ActionExecutingContext context, out PermissionsModel permissionsModel)
    {
        permissionsModel = new PermissionsModel();
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

        var protectionAttribute = descriptor.MethodInfo.GetCustomAttribute<ProtectedEntityActionAttribute>(inherit: true);
        if (protectionAttribute == null)
        {
            // Route is not protected.
            return false;
        }

        // Get the argument that will be used for permissions check.
        var argument = context.ActionArguments.FirstOrDefault(a => a.Key == protectionAttribute.ArgumentName);

        if (string.IsNullOrEmpty(argument.Key))
        {
            throw new ArgumentException(
                $"Action {context.ActionDescriptor.DisplayName} does not have an argument with name " +
                $"{protectionAttribute.ArgumentName} and entity permission check could not be initiated.");
        }

        if (argument.Value == null)
        {
            // Passed argument for validation is null, so no need to check permissions.
            return false;
        }

        var permissionsServiceInterfaceType = typeof(IEntityPermissionsService<,>);
        var argumentType = argument.Value.GetType();
        Type entityType;
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
                    $"Generic arguments of interface {interfaceType.FullName} should be at least 2." +
                    $"First for entity type, second for value (validate against) type");
            }

            entityType = serviceArguments[0];
            var serviceArgumentType = serviceArguments[1];
            if (serviceArgumentType != argumentType)
            {
                throw new InvalidOperationException(
                    $"Type of the Action argument does not match with the TInput type of the provided permissions service." +
                    $"Action argument is {argumentType}, service expects {serviceArgumentType}");
            }
        }
        else
        {
            // Get the default entity type from the controller and value type from the argument.
            entityType = controllerBaseType.GetGenericArguments().First();
        }

        var permissionsServiceType = permissionsServiceInterfaceType.MakeGenericType(entityType, argumentType);

        permissionsModel = new PermissionsModel
        {
            Value = argument.Value,
            Action = protectionAttribute.Action,
            PermissionsServiceType = permissionsServiceType,
        };

        return true;
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
        PermissionsModel permissionsModel)
    {
        if (permissionsModel.Action == Unrestricted)
        {
            return (true, null);
        }

        var permissionsServiceInstance = this.serviceProvider.GetService(permissionsModel.PermissionsServiceType);
        if (permissionsServiceInstance == null)
        {
            // Forbid any action, when no service is implemented for the given input.
            return (false,
                $"Action \"{permissionsModel.Action}\" is forbidden for user." +
                $"Could not resolve service of type {permissionsModel.PermissionsServiceType.FullName}");
        }

        const string methodName = nameof(IEntityPermissionsService<IEntity, object>.HasPermission);
        var permissionsServiceInstanceType = permissionsServiceInstance.GetType();
        var method = permissionsServiceInstanceType.GetMethod(methodName, BindingFlags.Instance | BindingFlags.Public);
        if (method == null)
        {
            throw new InvalidOperationException(
                $"Method {methodName} could not be found on the provided entity permissions service.");
        }

        var task = method.Invoke(permissionsServiceInstance, [user, permissionsModel.Value, permissionsModel.Action]);
        if (task is not Task<bool> resultTask)
        {
            throw new InvalidOperationException(
                $"{methodName} method on the {permissionsServiceInstanceType.FullName} service should return Task<bool>.");
        }

        var result = await resultTask;
        return (result, null);
    }

    private class PermissionsModel
    {
        public object Value { get; set; } = default!;
        public string Action { get; set; } = default!;
        public Type PermissionsServiceType { get; set; } = default!;
    }
}