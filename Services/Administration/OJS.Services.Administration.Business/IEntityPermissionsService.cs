namespace OJS.Services.Administration.Business;

using OJS.Services.Common.Models.Users;
using OJS.Data.Infrastructure.Models;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

/// <summary>
/// Service used to check if a user has permission to perform an action
/// on a <typeparamref name="TEntity"/> given a <typeparamref name="TValue"/> input.
/// <remarks>
/// <see cref="TEntity"/> is used to register different services for different entities,
/// without needing to make interfaces for each of them.
/// <see cref="TValue"/> is the value to validate permissions against.
/// If you want custom validation for a specific entity/value pair,
/// you can just implement this interface with the specific <see cref="TEntity"/> and <see cref="TValue"/>.
/// </remarks>
/// </summary>
/// <typeparam name="TEntity">Entity type to validate for.</typeparam>
/// <typeparam name="TValue">Value to validate against.</typeparam>
public interface IEntityPermissionsService<in TEntity, in TValue> : IScopedService
    where TEntity : IEntity
{
    /// <summary>
    /// Gets whether the user has permission to perform the operation
    /// on the <typeparamref name="TEntity"/> entity,
    /// given the <typeparamref name="TValue"/> value to validate against.
    /// </summary>
    /// <param name="user">The user performing the operation.</param>
    /// <param name="value">The input that will be validated.</param>
    /// <param name="operation">The administration operation being executed.</param>
    /// <returns>True if the user can do the operation on the entity.</returns>
    public Task<bool> HasPermission(UserInfoModel user, TValue value, string operation);
}