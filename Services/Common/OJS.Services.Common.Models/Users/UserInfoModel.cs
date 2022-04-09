namespace OJS.Services.Common.Models.Users;

using AutoMapper;
using OJS.Common.Extensions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Security.Claims;

public class UserInfoModel : IMapExplicitly
{
    public string? Id { get; set; }

    public bool IsAdmin { get; set; }

    public bool IsLecturer { get; set; }

    public bool IsAdminOrLecturer => this.IsAdmin || this.IsLecturer;

    public bool IsNotAdminButLecturer => !this.IsAdmin && this.IsLecturer;

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<ClaimsPrincipal, UserInfoModel>()
            .ForMember(
                m => m.Id,
                opt => opt.MapFrom(src => src.GetId()))
            .ForMember(
                m => m.IsAdmin,
                opt => opt.MapFrom(src => src.IsAdmin()))
            .ForMember(
                m => m.IsLecturer,
                opt => opt.MapFrom(src => src.IsLecturer()));
}