using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Collections.Generic;

namespace OJS.Services.Ui.Models.SubmissionTypes
{
    public class SubmissionTypeServiceModel : IMapFrom<SubmissionType>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsSelectedByDefault { get; set; }

        public bool AllowBinaryFilesUpload { get; set; }

        public IEnumerable<string> AllowedFileExtensions { get; set; }
    }
}