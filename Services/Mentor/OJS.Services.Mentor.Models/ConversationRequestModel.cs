namespace OJS.Services.Mentor.Models;

public class ConversationRequestModel
{
    public string UserId { get; set; } = default!;

    public ICollection<ConversationMessageModel> Messages { get; set; } = [];

    public int ProblemId { get; set; }

    public string ProblemName { get; set; } = default!;

    public int ContestId { get; set; }

    public string ContestName { get; set; } = default!;

    public string CategoryName { get; set; } = default!;

    public string SubmissionTypeName { get; set; } = default!;
}