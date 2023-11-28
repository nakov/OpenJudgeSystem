namespace OJS.Servers.Administration.Controllers;

using Microsoft.Extensions.Options;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Models;

public class SubmissionTypesController : BaseAutoCrudAdminController<SubmissionType>
{
    public SubmissionTypesController(IOptions<ApplicationConfig> appConfigOptions)
        : base(appConfigOptions)
    {
    }
}