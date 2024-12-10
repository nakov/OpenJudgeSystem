namespace OJS.Services.Administration.Models.AccessLogs;

using System;
using OJS.Data.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class AccessLogInListModel: IMapFrom<AccessLog>
{
    public int Id { get; set; }

    public string UserId { get; set; } = default!;

    public string UserUserName { get; set; } = default!;

    public string IpAddress { get; set; } = default!;

    public string RequestType { get; set; } = default!;

    public string Url { get; set; } = default!;

    public string? PostParams { get; set; }

    public DateTime CreatedOn { get; set; }
}