namespace OJS.Services.Administration.Models.Participants
{
    using OJS.Data.Models.Participants;
    using System;
    using System.Linq.Expressions;

    public class ParticipantModel
    {
        public static Expression<Func<Participant, ParticipantModel>> Model =>
            p => new ParticipantModel
            {
                Id = p.Id,
                UserName = p.User.UserName,
                FirstName = p.User.UserSettings.FirstName,
                LastName = p.User.UserSettings.LastName,
            };

        public int Id { get; set; }

        public string UserName { get; set; } = string.Empty;

        public string? FirstName { get; set; }

        public string? LastName { get; set; }
    }
}