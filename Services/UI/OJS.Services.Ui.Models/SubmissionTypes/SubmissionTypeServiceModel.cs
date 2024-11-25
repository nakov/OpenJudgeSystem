namespace OJS.Services.Ui.Models.SubmissionTypes
{
    using System;
    using System.Collections.Generic;
    using AutoMapper;
    using OJS.Data.Models;
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

        public double? MemoryLimit { get; set; }

        public double? TimeLimit { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
        {
            configuration.CreateMap<SubmissionType, SubmissionTypeServiceModel>()
                .ForMember(
                    d => d.AllowedFileExtensions,
                    opt => opt.MapFrom(s =>
                        s.AllowedFileExtensions != null
                            ? s.AllowedFileExtensions.Split(
                                this.allowedFileExtensionsDelimiters,
                                StringSplitOptions.RemoveEmptyEntries)
                            : Array.Empty<string>()))
                .ForMember(d => d.TimeLimit, opt => opt.Ignore())
                .ForMember(d => d.MemoryLimit, opt => opt.Ignore());

            configuration.CreateMap<SubmissionTypeInProblem, SubmissionTypeServiceModel>()
                .ForMember(
                    d => d.Id,
                    opt => opt.MapFrom(s => s.SubmissionType.Id))
                .ForMember(
                    d => d.Name,
                    opt => opt.MapFrom(s => s.SubmissionType.Name))
                .ForMember(
                    d => d.AllowBinaryFilesUpload,
                    opt => opt.MapFrom(s => s.SubmissionType.AllowBinaryFilesUpload))
                .ForMember(
                    d => d.IsSelectedByDefault,
                    opt => opt.MapFrom(s => s.SubmissionType.IsSelectedByDefault))
                .ForMember(
                    d => d.TimeLimit,
                    opt => opt.MapFrom(s => s.TimeLimit != null ? (double?)s.TimeLimit : null))
                .ForMember(
                    d => d.MemoryLimit,
                    opt => opt.MapFrom(s => s.MemoryLimit != null ? (double?)s.MemoryLimit : null))
                .ForMember(
                    d => d.AllowedFileExtensions,
                    opt => opt.MapFrom(s =>
                        s.SubmissionType.AllowedFileExtensions != null
                            ? s.SubmissionType.AllowedFileExtensions.Split(
                                this.allowedFileExtensionsDelimiters,
                                StringSplitOptions.RemoveEmptyEntries)
                            : Array.Empty<string>()))
                .ReverseMap();
        }
    }
}
