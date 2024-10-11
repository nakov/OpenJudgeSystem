namespace OJS.Services.Administration.Models.Participants;

using System;

public class ChangeParticipationTimeForMultipleParticipantsModel : ChangeParticipationTimeModel
{
    public DateTime ChangeParticipationTimeRangeStart { get; set; }

    public DateTime ChangeParticipationTimeRangeEnd { get; set; }
}