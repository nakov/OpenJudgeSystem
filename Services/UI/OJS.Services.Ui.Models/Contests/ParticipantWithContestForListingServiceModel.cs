namespace OJS.Services.Ui.Models.Contests;

using AutoMapper;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Participants;
using OJS.Services.Common.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;
using System.Linq;

public class ParticipantWithContestForListingServiceModel : IMapFrom<Participant>
{
    public DateTime CreatedOn { get; set; }

    public ContestForListingServiceModel Contest { get; set; } = null!;
}