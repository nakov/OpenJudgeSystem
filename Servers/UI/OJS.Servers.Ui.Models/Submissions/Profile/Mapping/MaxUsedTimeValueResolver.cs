namespace OJS.Servers.Ui.Models.Submissions.Profile.Mapping
{
    using AutoMapper;
    using OJS.Services.Ui.Models.Submissions;
    using System.Linq;

    public class MaxUsedTimeValueResolver
        : IValueResolver<SubmissionForProfileServiceModel, SubmissionForProfileResponseModel, double>
    {
        private readonly double defaultValue = 0.0;

        public double Resolve(
            SubmissionForProfileServiceModel source,
            SubmissionForProfileResponseModel destination,
            double destMember,
            ResolutionContext context)
            => source.TestRuns.Any()
                ? source.TestRuns.Max(tr => tr.TimeUsed)
                : this.defaultValue;
    }
}