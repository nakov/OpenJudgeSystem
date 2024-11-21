namespace OJS.Servers.Ui.Controllers;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Mentor.Business;
using OJS.Services.Mentor.Models;
using static Microsoft.AspNetCore.Http.StatusCodes;

[Authorize]
public class MentorController : BaseApiController
{
    private readonly IMentorBusinessService mentorBusiness;

    public MentorController(IMentorBusinessService mentorBusiness)
        => this.mentorBusiness = mentorBusiness;

    /// <summary>
    /// Starts a new conversation with the mentor.
    /// </summary>
    /// <param name="model">A request model containing the details, necessary for starting a conversation.</param>
    /// <returns>A response model, containing the conversation's data.</returns>
    [ProducesResponseType(typeof(ConversationResponseModel), Status200OK)]
    [HttpPost]
    public async Task<IActionResult> StartConversation(ConversationRequestModel model)
        => await this.mentorBusiness.StartConversation(model)
            .ToOkResult();
}