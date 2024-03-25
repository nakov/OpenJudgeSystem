namespace OJS.Services.Administration.Models.Roles;

using OJS.Common.Enumerations;

public class UserToRoleModel
{
    public string? RoleId { get; set; }

    public string? UserId { get; set; }

    public CrudOperationType OperationType { get; set; }
}