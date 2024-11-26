namespace OJS.Services.Administration.Models.ParticipantScores.Models;

using System;
using System.Linq.Expressions;
using OJS.Data.Models.Participants;

public class ParticipantScoreDataModel
{
    public static Expression<Func<Participant, ParticipantScoreDataModel>> FromParticipant =>
        participant => new ParticipantScoreDataModel
        {
            Participant = participant, IsOfficial = participant.IsOfficial, UserName = participant.User.UserName,
        };

    public Participant? Participant { get; set; }

    public bool IsOfficial { get; set; }

    public string? UserName { get; set; }
}