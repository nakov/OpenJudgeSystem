using AutoMapper;
using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;
using System.Collections.Generic;

namespace OJS.Services.Ui.Models.SubmissionTypes
{
    public class SubmissionTypeServiceModel : IMapExplicitly
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsSelectedByDefault { get; set; }

        public bool AllowBinaryFilesUpload { get; set; }

        public IEnumerable<string>? AllowedFileExtensions { get; set; }

        public void RegisterMappings(IProfileExpression configuration) =>
            configuration.CreateMap<SubmissionType, SubmissionTypeServiceModel>()
                .ForMember(d =>
                    d.AllowedFileExtensions, opt
                    => opt.MapFrom(s => s.AllowedFileExtensions.Split(",", StringSplitOptions.RemoveEmptyEntries)));
    }
}