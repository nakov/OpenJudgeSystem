namespace OJS.Servers.Ui.Models.SubmissionTypes
{
    using OJS.Services.Ui.Models.SubmissionTypes;
    using OJS.Services.Infrastructure.Models.Mapping;
    using System.Collections.Generic;

    public class SubmissionTypeResponseModel : IMapFrom<SubmissionTypeServiceModel>
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public bool AllowBinaryFilesUpload { get; set; }

        public IEnumerable<string>? AllowedFileExtensions { get; set; }
    }
}