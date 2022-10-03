using OJS.Services.Ui.Models.SubmissionTypes;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Collections.Generic;

namespace OJS.Servers.Ui.Models.SubmissionTypes
{
    public class SubmissionTypeResponseModel : IMapFrom<SubmissionTypeServiceModel>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsSelectedByDefault { get; set; }

        public bool AllowBinaryFilesUpload { get; set; }

        public IEnumerable<string>? AllowedFileExtensions { get; set; }
    }
}