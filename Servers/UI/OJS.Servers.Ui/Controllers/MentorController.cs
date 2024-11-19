namespace OJS.Servers.Ui.Controllers;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Mentor.Business;
using OJS.Services.Mentor.Models;

[Authorize]
public class MentorController : BaseApiController
{
    private readonly IMentorBusinessService mentorBusiness;

    public MentorController(IMentorBusinessService mentorBusiness)
        => this.mentorBusiness = mentorBusiness;

    [HttpPost]
    public async Task<IActionResult> StartConversation(ConversationRequestModel model)
        => await this.mentorBusiness.StartConversation(model)
            .ToOkResult();
}