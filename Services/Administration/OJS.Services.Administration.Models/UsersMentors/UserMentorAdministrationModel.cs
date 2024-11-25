namespace OJS.Services.Administration.Models.UsersMentors;

using System;
using AutoMapper;
using OJS.Data.Models.Mentor;
using OJS.Data.Models.Users;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class UserMentorAdministrationModel : BaseAdministrationModel<string>, IMapExplicitly
{
    public virtual UserProfile User { get; set; } = null!;

    public DateTimeOffset QuotaResetTime { get; set; }

    public int RequestsMade { get; set; }

    public int? QuotaLimit { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<UserMentor, UserMentorAdministrationModel>()
            .ForMember(d => d.OperationType, opt => opt.Ignore())
            .ReverseMap();
}