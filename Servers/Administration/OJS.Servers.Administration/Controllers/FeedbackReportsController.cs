namespace OJS.Servers.Administration.Controllers;

using Microsoft.Extensions.Options;
using OJS.Data.Models;
using OJS.Services.Administration.Models;

public class FeedbackReportsController : BaseAutoCrudAdminController<FeedbackReport>
{
    public FeedbackReportsController(IOptions<ApplicationConfig> appConfigOptions)
        : base(appConfigOptions)
    {
    }
}