using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Services.Ui.Models.Submissions
{
    public class ProblemServiceModel : IMapFrom<Problem>
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public short MaximumPoints { get; set; }
    }
}