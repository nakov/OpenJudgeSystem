using OJS.Services.Common.Models.PubSubContracts.ExecutionResult;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Services.Ui.Models.Submissions
{
    public class CheckerDetailsResponseModel : IMapFrom<CheckerDetails>
    {
        public string Comment { get; set; } = null!;

        public string ExpectedOutputFragment { get; set; } = null!;

        public string UserOutputFragment { get; set; } = null!;
    }
}