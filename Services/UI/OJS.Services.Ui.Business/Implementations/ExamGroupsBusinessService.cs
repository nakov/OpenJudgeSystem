namespace OJS.Services.Ui.Business.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data.Models;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Users;
    using OJS.Services.Common.Models.Users;
    using OJS.Services.Infrastructure;
    using OJS.Services.Infrastructure.BackgroundJobs;
    using OJS.Services.Infrastructure.HttpClients;
    using OJS.Services.Ui.Data;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using static OJS.Common.GlobalConstants;
    using static OJS.Common.GlobalConstants.Urls;

    public class ExamGroupsBusinessService : IExamGroupsBusinessService
    {
        private const string ExamGroupCannotBeNullMessage = "Exam group cannot be null";

        private readonly IExamGroupsDataService examGroupsData;
        private readonly IUsersProfileDataService usersProfileData;
        private readonly ISulsPlatformHttpClientService sulsPlatformHttpClient;
        private readonly IHangfireBackgroundJobsService backgroundJobs;

        public ExamGroupsBusinessService(
            IExamGroupsDataService examGroupsData,
            IUsersProfileDataService usersProfileData,
            ISulsPlatformHttpClientService sulsPlatformHttpClient,
            IHangfireBackgroundJobsService backgroundJobs)
        {
            this.examGroupsData = examGroupsData;
            this.usersProfileData = usersProfileData;
            this.sulsPlatformHttpClient = sulsPlatformHttpClient;
            this.backgroundJobs = backgroundJobs;
        }

        public async Task AddUsersByIdAndUserIds(int id, IEnumerable<string> userIds)
        {
            var examGroup = await this.GetExamGroup(id);

            var users = this.usersProfileData
                .GetQuery()
                .Where(u => userIds.Contains(u.Id));

            await this.AddUsersToExamGroup(examGroup, users);

            var externalUserIds = userIds.Except(users.Select(u => u.Id)).ToList();

            if (externalUserIds.Any())
            {
                this.backgroundJobs.AddFireAndForgetJob<IExamGroupsBusinessService>(
                    x => x.AddExternalUsersByIdAndUserIds(examGroup.Id, externalUserIds),
                    BackgroundJobs.UiQueueName);
            }
        }

        public async Task AddUsersByIdAndUsernames(int id, IEnumerable<string> usernames)
        {
            var examGroup = await this.GetExamGroup(id);

            var users = this.usersProfileData
                .GetQuery()
                .Where(u => usernames.Contains(u.UserName));

            await this.AddUsersToExamGroup(examGroup, users);

            var externalUsernames = usernames
                .Except(users.Select(u => u.UserName!), StringComparer.OrdinalIgnoreCase)
                .ToList();

            if (externalUsernames.Any())
            {
                this.backgroundJobs.AddFireAndForgetJob<IExamGroupsBusinessService>(
                    x => x.AddExternalUsersByIdAndUsernames(examGroup.Id, externalUsernames),
                    BackgroundJobs.UiQueueName);
            }
        }

        public async Task RemoveUsersByIdAndUserIds(int id, IEnumerable<string> userIds)
        {
            var examGroup = await this.GetExamGroup(id);

            examGroup.UsersInExamGroups = examGroup.UsersInExamGroups.Where(u => !userIds.Contains(u.UserId)).ToList();

            this.examGroupsData.Update(examGroup);
        }

        public async Task AddExternalUsersByIdAndUserIds(int id, IEnumerable<string> userIds)
        {
            var examGroup = await this.GetExamGroup(id);

            foreach (var userId in userIds)
            {
                await this.AddExternalUser(examGroup, userId);
            }
        }

        public async Task AddExternalUsersByIdAndUsernames(int id, IEnumerable<string> usernames)
        {
            var examGroup = await this.GetExamGroup(id);

            foreach (var username in usernames)
            {
                await this.AddExternalUser(examGroup, null, username);
            }
        }

        private async Task AddExternalUser(ExamGroup examGroup, string? userId, string? username = null)
        {
            ExternalDataRetrievalResult<ExternalUserInfoModel> response;

            if (userId != null)
            {
                response = await this.sulsPlatformHttpClient.GetAsync<ExternalUserInfoModel>(
                    new { userId },
                    GetUserInfoByIdPath);
            }
            else if (username != null)
            {
                response = await this.sulsPlatformHttpClient.GetAsync<ExternalUserInfoModel>(
                    new { username },
                    GetUserInfoByUsernamePath);
            }
            else
            {
                throw new ArgumentNullException(nameof(username));
            }

            if (response.IsSuccess)
            {
                if (response.Data == null)
                {
                    return;
                }

                var user = response.Data.Entity;
                examGroup.UsersInExamGroups.Add(new UserInExamGroup { User = user });
                this.examGroupsData.Update(examGroup);
            }
            else
            {
                throw new Exception(response.ErrorMessage);
            }
        }

        private async Task<ExamGroup> GetExamGroup(int examGroupId)
        {
            var examGroup = await this.examGroupsData.OneById(examGroupId);

            if (examGroup == null)
            {
                throw new ArgumentNullException(nameof(examGroupId), ExamGroupCannotBeNullMessage);
            }

            return examGroup;
        }

        private async Task AddUsersToExamGroup(ExamGroup examGroup, IQueryable<UserProfile> users)
        {
            var usersToAdd = await users
                .Where(u => u.UsersInExamGroups.All(eg => eg.ExamGroupId != examGroup.Id))
                .ToListAsync();

            foreach (var user in usersToAdd)
            {
                if (user.IsDeleted)
                {
                    user.IsDeleted = false;
                }

                examGroup.UsersInExamGroups.Add(new UserInExamGroup { User = user });
            }

            this.examGroupsData.Update(examGroup);
            await this.examGroupsData.SaveChanges();
        }
    }
}