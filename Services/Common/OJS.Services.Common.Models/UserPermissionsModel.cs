namespace OJS.Services.Common.Models;

using System;

public record UserPermissionsModel(string UserId, object? EntityId, Type EntityType)
{
    public bool CanRead { get; private set; }

    public bool CanCreate { get; private set; }

    public bool CanEdit { get; private set; }

    public bool CanDelete { get; private set; }

    public UserPermissionsModel WithFullWriteAccess(bool allow)
    {
        this.CanCreate = allow;
        this.CanEdit = allow;
        this.CanDelete = allow;

        return this;
    }

    public UserPermissionsModel WithReadAccess(bool allow)
    {
        this.CanRead = allow;
        return this;
    }

    public UserPermissionsModel WithFullAccess(bool allow)
    {
        this.WithReadAccess(allow);
        this.WithFullWriteAccess(allow);

        return this;
    }
}