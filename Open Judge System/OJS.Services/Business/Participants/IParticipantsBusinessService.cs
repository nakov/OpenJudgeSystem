﻿namespace OJS.Services.Business.Participants
{
    using System;

    using OJS.Data.Models;
    using OJS.Services.Common;

    public interface IParticipantsBusinessService : IService
    {
        bool CanCompeteByContestAndUserId(Contest contest, string userId);

        Participant CreateNewByContestUserIdIsOfficialAndIsAdmin(
            Contest contest,
            string userId,
            bool isOfficial,
            bool isAdmin);

        void ChangeTimeForActiveInOnlineContestByContestIdAndMinutes(
            int contestId,
            int minutes,
            DateTime after,
            DateTime before);
    }
}