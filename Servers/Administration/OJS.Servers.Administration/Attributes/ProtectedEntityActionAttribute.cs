namespace OJS.Servers.Administration.Attributes;

using System;
using static OJS.Services.Administration.Models.AdministrationConstants.AdministrationActions;

[AttributeUsage(AttributeTargets.Method, Inherited = true)]
public class ProtectedEntityActionAttribute : Attribute
{
    public ProtectedEntityActionAttribute(bool isProtected = true)
        => this.Action =
            isProtected
                ? Restricted
                : Unrestricted;

    public ProtectedEntityActionAttribute(string action)
        => this.Action = action;

    public string Action { get; }
}