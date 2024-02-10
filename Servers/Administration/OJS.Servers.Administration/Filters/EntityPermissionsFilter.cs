namespace OJS.Servers.Administration.Filters;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using OJS.Servers.Administration.Attributes;
using OJS.Servers.Administration.Controllers.Api;
using OJS.Services.Administration.Business;
using OJS.Services.Common.Models.Pagination;
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
        if (ShouldCheckPermissions(context, out var permissionsModel))
        {
            var (userHasPermissionsForAction, message) = await this.UserHasPermissions(
                context.HttpContext.User.Map<UserInfoModel>(),
                permissionsModel.EntityType,
                permissionsModel.ValueType,
                permissionsModel.Value,
                permissionsModel.Action);

            if (!userHasPermissionsForAction)
            {
                context.Result = new UnauthorizedObjectResult(
                    message ??
                    $"You are not authorized to perform \"{permissionsModel.Action}\" action " +
                    $"on this \"{permissionsModel.EntityType.Name}\" entity instance.");
                return;
            }
        }

        await next();
    }

    private static bool ShouldCheckPermissions(ActionExecutingContext context, out PermissionsModel permissionsModel)
    {
        permissionsModel = new PermissionsModel();
        if (!context.ActionArguments.Any())
        {
            // No need to run permission checks, when no arguments are passed to action.
            return false;
        }

        var baseType = context.Controller.GetType().BaseType;
        if (baseType == null ||
            !baseType.IsGenericType ||
            baseType.GetGenericTypeDefinition() != typeof(BaseAdminApiController<,,,>))
        {
            throw new InvalidOperationException("Filter should be used only on Generic BaseAdminApiController.");
        }

        // Get the argument that will be used for permissions check (some id or model),
        // excluding the PaginationRequestModel, as it should not be related to permissions.
        var argument = context.ActionArguments
            .FirstOrDefault(a => a.Value != null && a.Value.GetType() != typeof(PaginationRequestModel));

        if (argument.Value == null)
        {
            // Passed argument for validation is null, so no need to check permissions.
            return false;
        }

        if (context.ActionDescriptor is not ControllerActionDescriptor descriptor)
        {
            // No controller action is called.
            return false;
        }

        // Get the action from the custom attribute on the endpoint, or restrict it by default.
        var action = descriptor.MethodInfo.GetCustomAttribute<ProtectedEntityActionAttribute>(inherit: true)
            ?.Action ?? Restricted;

        permissionsModel = new PermissionsModel
        {
            EntityType = baseType.GetGenericArguments().First(),
            ValueType = argument.Value.GetType(),
            Value = argument.Value,
            Action = action,
        };

        return true;
    }

    /// <summary>
    /// Method to determine if the user has permissions for some action on an entity, given an input.
    /// It will use an instance of a specific entity permissions service,
    /// that will validate the user permissions against the provided input and return true or false.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="entityType">Type of the entity for constructing the entity permissions service.</param>
    /// <param name="inputType">Type of the input to validate against.</param>
    /// <param name="input">The input to validate against.</param>
    /// <param name="action">The action being performed.</param>
    /// <returns>
    /// True if the given user has permissions for the given action on the given entity,
    /// validated against the given input. Otherwise False and possibly a message with explanation.
    /// </returns>
    /// <exception cref="InvalidOperationException">
    /// When IEntityPermissionsService does not return expected Task with boolean result.
    /// </exception>
    private async Task<(bool, string? message)> UserHasPermissions(
        UserInfoModel user,
        Type entityType,
        Type inputType,
        object input,
        string action)
    {
        if (action == Unrestricted)
        {
            return (true, null);
        }

        var permissionsServiceType = typeof(IEntityPermissionsService<,>).MakeGenericType(entityType, inputType);
        var permissionsServiceInstance = this.serviceProvider.GetService(permissionsServiceType);

        if (permissionsServiceInstance == null)
        {
            // Forbid any action, when no service is implemented for the given input.
            return (false,
                $"Action \"{action}\" is forbidden for user. No implementation is found " +
                $"for service {nameof(IEntityPermissionsService<IEntity, object>)} " +
                $"with entity type {entityType.Name}, " +
                $"accepting input of type {inputType.Name}.");
        }

        const string methodName = nameof(IEntityPermissionsService<IEntity, object>.HasPermission);
        var permissionsServiceInstanceType = permissionsServiceInstance.GetType();
        var method = permissionsServiceInstanceType.GetMethod(methodName, BindingFlags.Instance | BindingFlags.Public)!;

        var task = method.Invoke(permissionsServiceInstance, [user, input, action]);

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
        public Type EntityType { get; set; } = default!;
        public Type ValueType { get; set; } = default!;
        public object Value { get; set; } = default!;
        public string Action { get; set; } = default!;
    }
}