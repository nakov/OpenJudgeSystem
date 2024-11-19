namespace OJS.Services.Mentor.Models;

using OpenAI.Chat;

public class ConversationMessageModel
{
    public string Content { get; set; } = default!;

    public ChatMessageRole Role { get; set; }

    public int SequenceNumber { get; set; }
}