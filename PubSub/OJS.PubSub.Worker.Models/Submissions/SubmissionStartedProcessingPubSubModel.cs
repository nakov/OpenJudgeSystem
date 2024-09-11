namespace OJS.PubSub.Worker.Models.Submissions;

public class SubmissionStartedProcessingPubSubModel
{
    public int SubmissionId { get; set; }

    public DateTimeOffset ProcessingStartedAt { get; set; }
}