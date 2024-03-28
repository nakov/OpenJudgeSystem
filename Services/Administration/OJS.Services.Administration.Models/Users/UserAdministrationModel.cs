namespace OJS.Services.Administration.Models.Users;

using AutoMapper;
using OJS.Data.Models.Users;
using OJS.Services.Administration.Models.Roles;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Collections.Generic;
using System.Linq;

public class UserAdministrationModel : BaseAdministrationModel<string>, IMapExplicitly
{
    public string? Email { get; set; }

    public string? UserName { get; set; }

    public UserSettingsAdministrationModel? UserSettings { get; set; }

    public List<RoleResponseModel> Roles { get; set; } = new();

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<UserProfile, UserAdministrationModel>()
            .ForMember(uam => uam.Roles, opt
                => opt.MapFrom(ur => ur.UsersInRoles.Select(uir => uir.Role)));

        configuration.CreateMap<UserAdministrationModel, UserProfile>()
            .ForMember(up => up.IsDeleted, opt
                => opt.Ignore())
            .ForMember(up => up.DeletedOn, opt
                => opt.Ignore())
            .ForMember(up => up.CreatedOn, opt
                => opt.Ignore())
            .ForMember(up => up.ModifiedOn, opt
                => opt.Ignore())
            .ForMember(up => up.LecturersInContestCategories, opt
                => opt.Ignore())
            .ForMember(up => up.LecturersInContests, opt
                => opt.Ignore())
            .ForMember(up => up.UsersInExamGroups, opt
                => opt.Ignore())
            .ForMember(up => up.UsersInRoles, opt
                => opt.Ignore())
            .ForMember(up => up.NormalizedUserName, opt
                => opt.Ignore())
            .ForMember(up => up.NormalizedEmail, opt
                => opt.Ignore())
            .ForMember(up => up.EmailConfirmed, opt
                => opt.Ignore())
            .ForMember(up => up.PasswordHash, opt
                => opt.Ignore())
            .ForMember(up => up.SecurityStamp, opt
                => opt.Ignore())
            .ForMember(up => up.ConcurrencyStamp, opt
                => opt.Ignore())
            .ForMember(up => up.PhoneNumber, opt
                => opt.Ignore())
            .ForMember(up => up.PhoneNumberConfirmed, opt
                => opt.Ignore())
            .ForMember(up => up.PhoneNumber, opt
                => opt.Ignore())
            .ForMember(up => up.PhoneNumberConfirmed, opt
                => opt.Ignore())
            .ForMember(up => up.TwoFactorEnabled, opt
                => opt.Ignore())
            .ForMember(up => up.LockoutEnd, opt
                => opt.Ignore())
            .ForMember(up => up.LockoutEnabled, opt
                => opt.Ignore())
            .ForMember(up => up.AccessFailedCount, opt
                => opt.Ignore());
    }
}