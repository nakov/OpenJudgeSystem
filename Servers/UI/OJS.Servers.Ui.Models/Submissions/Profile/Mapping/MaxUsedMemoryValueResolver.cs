namespace OJS.Servers.Ui.Models.Submissions.Profile.Mapping
{
    using AutoMapper;
    using OJS.Services.Ui.Models.Submissions;
    using System.Linq;

    public class MaxUsedMemoryValueResolver : IValueResolver<SubmissionForProfileServiceModel, SubmissionForProfileResponseModel, double>
    {
        public double Resolve(
            SubmissionForProfileServiceModel source,
            SubmissionForProfileResponseModel destination,
            double destMember,
            ResolutionContext context)
            => source.TestRuns.Any()
                ? source.TestRuns.Max(tr => tr.MemoryUsed)
                : default;
    }
}