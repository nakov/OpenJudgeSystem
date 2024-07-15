namespace OJS.Services.Administration.Business.Implementations
{
    using MassTransit;
    using Microsoft.Extensions.Logging;
    using OJS.Services.Administration.Business.Participants;
    using OJS.Services.Administration.Business.SubmissionsForProcessing;
    using OJS.Services.Common;
    using OJS.Services.Common.Exceptions;
    using System;
    using System.Threading.Tasks;

    public class RecurringBackgroundJobsBusinessService : IRecurringBackgroundJobsBusinessService
    {
        private readonly ISubmissionsForProcessingBusinessService submissionsForProcessing;
        private readonly IParticipantsBusinessService participantsBusinessService;
        private readonly IBusControl bus;
        private readonly ILogger<RecurringBackgroundJobsBusinessService> logger;

        public RecurringBackgroundJobsBusinessService(
            ISubmissionsForProcessingBusinessService submissionsForProcessing,
            IParticipantsBusinessService participantsBusinessService,
            IBusControl bus,
            ILogger<RecurringBackgroundJobsBusinessService> logger)
        {
            this.submissionsForProcessing = submissionsForProcessing;
            this.participantsBusinessService = participantsBusinessService;
            this.bus = bus;
            this.logger = logger;
        }

        public async Task<object> EnqueuePendingSubmissions()
        {
            var busHealth = this.bus.CheckHealth();

            if (busHealth.Status != BusHealthStatus.Healthy)
            {
                var errorMessage = $"Message bus health check failed. Current status: {Enum.GetName(typeof(BusHealthStatus), busHealth.Status)}. Please verify that the message bus server is running correctly.";
                this.logger.LogError(errorMessage);

                throw new MessageBusNotHealthyException(errorMessage);
            }

            var enqueuedSubmissionsCount = await this.submissionsForProcessing.EnqueuePendingSubmissions();

            return $"Successfully enqueued {enqueuedSubmissionsCount} pending submissions.";
        }

        public async Task<object> DeleteProcessedSubmissions()
        {
            await this.submissionsForProcessing.DeleteProcessedSubmissions();

            return "Successfully deleted all processed submissions from SubmissionsForProcessing table";
        }

        public async Task<object> UpdateTotalScoreSnapshotOfParticipants()
        {
           await this.participantsBusinessService.UpdateTotalScoreSnapshotOfParticipants();

           return "Successfully updated total score snapshot of participants";
        }

        public async Task<object> RemoveParticipantMultipleScores()
        {
            await this.participantsBusinessService.RemoveDuplicateParticipantScores();

            return "Successfully removed participant multiple scores";
        }
    }
}