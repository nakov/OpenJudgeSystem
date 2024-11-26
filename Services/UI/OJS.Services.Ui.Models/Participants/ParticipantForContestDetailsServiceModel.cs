namespace OJS.Services.Ui.Models.Participants;

using AutoMapper;
using OJS.Common.Enumerations;
using OJS.Data.Models.Participants;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;
using System;
using System.Collections.Generic;

public class ParticipantForContestDetailsServiceModel : IMapExplicitly, IParticipantForActivityServiceModel
{
    public bool IsInvalidated { get; set; }

    public bool IsOfficial { get; set; }

    public int ContestId { get; set; }

    public DateTime? ParticipationStartTime { get; set; }

    public DateTime? ParticipationEndTime { get; set; }

    public DateTime? ContestStartTime { get; set; }

    public DateTime? ContestEndTime { get; set; }

    public DateTime? ContestPracticeStartTime { get; set; }

    public DateTime? ContestPracticeEndTime { get; set; }

    public IEnumerable<ProblemForParticipantServiceModel>? Problems { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<Participant, ParticipantForContestDetailsServiceModel>()
            .ForMember(m => m.Problems,
                opt => opt.MapFrom(src =>
                    src.Contest.Type == ContestType.OnlinePracticalExam
                        ? src.ProblemsForParticipants
                        : null));
}