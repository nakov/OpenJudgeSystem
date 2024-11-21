namespace OJS.Services.Mentor.Models;

using OJS.Services.Infrastructure.Models.Mapping;

public class ConversationResponseModel : IMapFrom<ConversationRequestModel>
{
    public string UserId { get; set; } = default!;

    // Messages
    public ICollection<ConversationMessageModel> ConversationMessages { get; set; } = [];

    // LimitReachedMessage string?
}