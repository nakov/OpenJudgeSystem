namespace OJS.Services.Mentor.Models;

using OJS.Common.Enumerations;

public class ConversationMessageModel
{
    public string Content { get; set; } = default!;

    public MentorMessageRole Role { get; set; }

    public int SequenceNumber { get; set; }
}