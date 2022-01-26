using System;

namespace OJS.Services.Ui.Models.Contests
{
    public class ContestParticipationServiceModel
    {
        public ContestServiceModel Contest { get; set; }

        public DateTime? LastSubmissionTime { get; set; }

        public bool ContestIsCompete { get; set; }

        public double? RemainingTimeInMilliseconds { get; set; }

        private readonly DateTime? participationEndTime;
    }
}