namespace OJS.Servers.Administration.Attributes;

using System;
using static OJS.Services.Administration.Models.AdministrationConstants.AdministrationActions;

[AttributeUsage(AttributeTargets.Method, Inherited = true)]
public class ProtectedEntityActionAttribute : Attribute
{
    public ProtectedEntityActionAttribute(string argumentName)
    {
        this.ArgumentName = argumentName;
        this.Action = Restricted;
    }

    public ProtectedEntityActionAttribute(string argumentName, string action)
        : this(argumentName)
        => this.Action = action;

    public ProtectedEntityActionAttribute(string argumentName, Type permissionsServiceType)
        : this(argumentName)
        => this.PermissionsServiceType = permissionsServiceType;

    public ProtectedEntityActionAttribute(string argumentName, string action, Type permissionsServiceType)
        : this(argumentName, action)
        => this.PermissionsServiceType = permissionsServiceType;

    public string Action { get; }

    public string ArgumentName { get; }

    public Type? PermissionsServiceType { get; }
}