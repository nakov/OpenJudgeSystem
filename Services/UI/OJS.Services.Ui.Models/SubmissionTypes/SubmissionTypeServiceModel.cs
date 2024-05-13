namespace OJS.Services.Ui.Models.SubmissionTypes
{
    using System;
    using System.Collections.Generic;
    using AutoMapper;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Infrastructure.Models.Mapping;

    public class SubmissionTypeServiceModel : IMapExplicitly
    {
        private char[] allowedFileExtensionsDelimiters = { ',', ';', ' ' };

        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public bool IsSelectedByDefault { get; set; }

        public bool AllowBinaryFilesUpload { get; set; }

        public IEnumerable<string> AllowedFileExtensions { get; set; } = new List<string>();

        public void RegisterMappings(IProfileExpression configuration) =>
            configuration.CreateMap<SubmissionType, SubmissionTypeServiceModel>()
                .ForMember(
                    d => d.AllowedFileExtensions,
                    opt => opt.MapFrom(s =>
                        s.AllowedFileExtensions != null
                            ? s.AllowedFileExtensions.Split(
                                this.allowedFileExtensionsDelimiters,
                                StringSplitOptions.RemoveEmptyEntries)
                            : Array.Empty<string>()));
    }
}
