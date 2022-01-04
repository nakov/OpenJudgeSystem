using System.Linq;

namespace OJS.Servers.Ui.Models.Submissions.Profile.Mapping
{
    using AutoMapper;
    using OJS.Services.Ui.Models.Submissions;
    using System.Collections.Generic;

    public class MaxUsedMemoryValueResolver
        : IValueResolver<SubmissionServiceModel, SubmissionForProfileResponseModel, double>
    {
        private readonly double defaultValue = 0;

        public double Resolve(
            SubmissionServiceModel source,
            SubmissionForProfileResponseModel destination,
            double destMember,
            ResolutionContext context)
            => source.TestRuns.Any()
                ? source.TestRuns.Max(tr => tr.MemoryUsed)
                : this.defaultValue;
    }
}