namespace OJS.Servers.Ui.Models.Submissions.Profile
{
    using System;
    using OJS.Services.Ui.Models.Submissions;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using System.Collections.Generic;
    using AutoMapper;
    using OJS.Servers.Ui.Models.Submissions.Profile.Mapping;


    public class SubmissionForProfileResponseModel : IMapExplicitly
    {
        public int Id { get; set; }

        public DateTime SubmittedOn { get; set; }

        public ProblemResponseModel Problem { get; set; }

        public string SubmissionTypeName { get; set; }

        public int Points { get; set; }

        public IEnumerable<TestRunResponseModel> TestRuns { get; set; }

        public double MaxUsedTime { get; set; }

        public double MaxUsedMemory { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<SubmissionServiceModel, SubmissionForProfileResponseModel>()
                .ForMember(d => d.MaxUsedMemory, opt => opt.MapFrom<MaxUsedMemoryValueResolver>())
                .ForMember(d => d.MaxUsedTime, opt => opt.MapFrom<MaxUsedTimeValueResolver>());
    }
}