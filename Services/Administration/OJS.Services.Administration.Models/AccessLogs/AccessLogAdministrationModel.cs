namespace OJS.Services.Administration.Models.AccessLogs;

using System;
using AutoMapper;
using OJS.Data.Models;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class AccessLogAdministrationModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public string UserId { get; set; } = default!;

    public string UserUserName { get; set; } = default!;

    public string IpAddress { get; set; } = default!;

    public string RequestType { get; set; } = default!;

    public string Url { get; set; } = default!;

    public string? PostParams { get; set; }

    public DateTime CreatedOn { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<AccessLog, AccessLogAdministrationModel>()
            .ForMember(dest => dest.OperationType, opt => opt.Ignore());
}