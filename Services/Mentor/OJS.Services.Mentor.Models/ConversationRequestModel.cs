namespace OJS.Services.Mentor.Models;

public class ConversationRequestModel
{
    public string UserId { get; set; } = default!;

    public ICollection<ConversationMessageModel> ConversationMessages { get; set; } = [];

    public int ProblemId { get; set; }

    public string ProblemName { get; set; } = default!;

    public ICollection<MentorProblemResourceModel> ProblemResources { get; set; } = [];

    public int ContestId { get; set; }
}