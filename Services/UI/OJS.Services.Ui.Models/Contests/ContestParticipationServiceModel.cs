using AutoMapper;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Participants;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;
using System.Linq;

namespace OJS.Services.Ui.Models.Contests
{
    public class ContestParticipationServiceModel : IMapExplicitly
    {
        public ContestServiceModel Contest { get; set; }

        public DateTime? LastSubmissionTime { get; set; }

        public bool ContestIsCompete { get; set; }

        public double? RemainingTimeInMilliseconds { get; set; }

        public bool ShouldEnterPassword { get; set; }

        public ContestValidationModel Validation { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<Participant, ContestParticipationServiceModel>()
                .ForMember(d => d.Contest, opt => opt.MapFrom(s => s.Contest))
                .ForMember(d => d.LastSubmissionTime, opt => opt.MapFrom(s =>
                    s.Submissions.Any()
                        ? (DateTime?)s.Submissions.Max(x => x.CreatedOn)
                        : null))
                .ForMember(d => d.RemainingTimeInMilliseconds, opt => opt.MapFrom(s =>
                    s.ParticipationEndTime.HasValue
                        ? (s.ParticipationEndTime.Value - DateTime.Now).TotalMilliseconds
                        : 0))
                .ForAllOtherMembers(opt => opt.Ignore());
    }
}