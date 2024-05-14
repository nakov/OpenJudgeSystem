﻿namespace OJS.Services.Administration.Models.Roles;

using OJS.Data.Models.Users;
using OJS.Services.Infrastructure.Models.Mapping;

public class RoleResponseModel : IMapFrom<Role>
{
    public string? Id { get; set; }

    public string? Name { get; set; }
}