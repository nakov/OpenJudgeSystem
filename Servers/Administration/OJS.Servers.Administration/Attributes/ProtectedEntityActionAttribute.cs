namespace OJS.Servers.Administration.Attributes;

using OJS.Services.Administration.Business;
using System;
using static OJS.Services.Administration.Models.AdministrationConstants.AdministrationOperations;

/// <summary>
/// Attribute used to mark a method as requiring permissions to perform an action on an entity.
/// </summary>
[AttributeUsage(AttributeTargets.Method, Inherited = true)]
public class ProtectedEntityActionAttribute : Attribute
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ProtectedEntityActionAttribute"/> class
    /// wth the provided argument name.
    /// Restricted action is used by default.
    /// </summary>
    /// <param name="argumentName">The name of the Action argument that will be used to validate.</param>
    public ProtectedEntityActionAttribute(string argumentName)
    {
        this.ArgumentName = argumentName;
        this.Operation = Restricted;
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="ProtectedEntityActionAttribute"/> class
    /// wth the provided argument name and operation.
    /// </summary>
    /// <param name="argumentName">The name of the Action argument that will be used to validate.</param>
    /// <param name="operation">Administration operation name.</param>
    public ProtectedEntityActionAttribute(string argumentName, string operation)
        : this(argumentName)
        => this.Operation = operation;

    /// <summary>
    /// Initializes a new instance of the <see cref="ProtectedEntityActionAttribute"/> class
    /// with the provided argument name and permissions service type.
    /// Permission service should be assignable to <see cref="IEntityPermissionsService{TEntity, TValue}"/>.
    /// </summary>
    /// <param name="argumentName">The name of the Action argument that will be used to validate.</param>
    /// <param name="permissionsServiceType">Type of the specific permissions service that will be used.</param>
    public ProtectedEntityActionAttribute(string argumentName, Type permissionsServiceType)
        : this(argumentName)
        => this.PermissionsServiceType = permissionsServiceType;

    /// <summary>
    /// Initializes a new instance of the <see cref="ProtectedEntityActionAttribute"/> class
    /// with the provided argument name, operation and permissions service type.
    /// Permission service should be assignable to <see cref="IEntityPermissionsService{TEntity, TValue}"/>.
    /// </summary>
    /// <param name="argumentName">The name of the Action argument that will be used to validate.</param>
    /// /// <param name="operation">Administration operation name.</param>
    /// <param name="permissionsServiceType">Type of the specific permissions service that will be used.</param>
    public ProtectedEntityActionAttribute(string argumentName, string operation, Type permissionsServiceType)
        : this(argumentName, operation)
        => this.PermissionsServiceType = permissionsServiceType;

    public string Operation { get; }

    public string ArgumentName { get; }

    public Type? PermissionsServiceType { get; }
}