using AutoMapper;
using OJS.Common.Enumerations;
using OJS.Data.Models.Problems;
using OJS.Services.Ui.Models.SubmissionTypes;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Collections.Generic;
using System.Linq;

namespace OJS.Services.Ui.Models.Contests
{
    using OJS.Common.Extensions;

    public class ContestProblemServiceModel : IMapExplicitly
    {
        public int Id { get; set; }
        public int ContestId { get; set; }

        public string Name { get; set; }

        public int OrderBy { get; set; }

        public int MaximumPoints { get; set; }

        public bool ShowResults { get; set; }

        public int Points { get; set; }

        public bool IsExcludedFromHomework { get; set; }

        public double MemoryLimit
        {
            get => (double)this.memoryLimitInBytes / 1024 / 1024;

            set => this.memoryLimitInBytes = (int)value;
        }

        public double TimeLimit
        {
            get => this.timeLimitInMs / 1000.00;

            set => this.timeLimitInMs = (int)value;
        }

        public double? FileSizeLimit
        {
            get
            {
                if (!this.fileSizeLimitInBytes.HasValue)
                {
                    return null;
                }

                return (double)this.fileSizeLimitInBytes / 1024;
            }

            set => this.fileSizeLimitInBytes = (int?)value;
        }

        public string CheckerName { get; set; }

        public string CheckerDescription { get; set; }

        public IEnumerable<ContestProblemResourceServiceModel> Resources { get; set; }

        public IEnumerable<SubmissionTypeServiceModel> AllowedSubmissionTypes { get; set; }

        public bool UserHasAdminRights { get; set; }

        private int memoryLimitInBytes;

        private int timeLimitInMs;

        private int? fileSizeLimitInBytes;

        public void RegisterMappings(IProfileExpression configuration) =>
            configuration.CreateMap<Problem, ContestProblemServiceModel>()
                .ForMember(d => d.ContestId, opt => opt.MapFrom(s => s.ProblemGroup.ContestId))
                .ForMember(d => d.IsExcludedFromHomework,
                    opt => opt.MapFrom(s => s.ProblemGroup.Type == ProblemGroupType.ExcludedFromHomework))
                .ForMember(d => d.FileSizeLimit, opt => opt.MapFrom(s => s.SourceCodeSizeLimit))
                .ForMember(d => d.UserHasAdminRights, opt => opt.Ignore())
                .ForMember(d => d.AllowedSubmissionTypes,
                    opt => opt.MapFrom(s => s.SubmissionTypesInProblems.Select(st => st.SubmissionType)))
                .ForMember(
                    d => d.Points,
                    opt => opt.MapFrom(s => 0));

    }
}