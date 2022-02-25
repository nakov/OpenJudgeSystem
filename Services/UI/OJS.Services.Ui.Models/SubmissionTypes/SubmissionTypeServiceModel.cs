using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Services.Ui.Models.SubmissionTypes
{
    public class SubmissionTypeServiceModel : IMapFrom<SubmissionType>
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }
}