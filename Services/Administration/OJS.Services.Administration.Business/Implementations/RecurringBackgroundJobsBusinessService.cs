namespace OJS.Services.Administration.Business.Implementations
{
    using MassTransit;
    using Microsoft.Extensions.Logging;
    using OJS.Services.Administration.Business.Participants;
    using OJS.Services.Administration.Business.SubmissionsForProcessing;
    using OJS.Services.Common;
    using OJS.Services.Common.Exceptions;
    using OJS.Services.Infrastructure.Constants;
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
                this.logger.LogMessageBusHealthCheckFailed(Enum.GetName(typeof(BusHealthStatus), busHealth.Status));
                throw new MessageBusNotHealthyException("The message bus is not in a healthy state. Cannot enqueue pending submissions.");
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