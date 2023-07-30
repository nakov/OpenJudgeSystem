using OJS.Workers.Common;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Services.Ui.Models.Submissions
{
    public class CheckerDetailsResponseModel : IMapFrom<CheckerDetails>
    {
        public string? Comment { get; set; }

        public string? ExpectedOutputFragment { get; set; }

        public string? UserOutputFragment { get; set; }
    }
}