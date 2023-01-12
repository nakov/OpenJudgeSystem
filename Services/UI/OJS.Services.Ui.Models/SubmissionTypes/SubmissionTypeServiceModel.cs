using AutoMapper;
using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace OJS.Services.Ui.Models.SubmissionTypes
{
    public class SubmissionTypeServiceModel : IMapExplicitly
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public bool IsSelectedByDefault { get; set; }

        public bool AllowBinaryFilesUpload { get; set; }

        public IEnumerable<string>? AllowedFileExtensions { get; set; }

        public void RegisterMappings(IProfileExpression configuration) =>
            configuration.CreateMap<SubmissionType, SubmissionTypeServiceModel>()
                .ForMember(d => d.AllowedFileExtensions,
                    opt => opt.MapFrom(s =>
                        s.AllowedFileExtensions != null
                            ? s.AllowedFileExtensions.Split(new[] { ',', ';', ' ' },
                                StringSplitOptions.RemoveEmptyEntries)
                            : Enumerable.Empty<string>()))
                .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Name))
                .ForMember(d => d.IsSelectedByDefault, opt => opt.MapFrom(s => s.IsSelectedByDefault))
                .ForMember(d => d.AllowBinaryFilesUpload, opt => opt.MapFrom(s => s.AllowBinaryFilesUpload));
    }
}