namespace OJS.Services.Common.Models.Mappings;

using AutoMapper;
using OJS.Data.Models.Submissions;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using System.Linq;

public class TimeLimitResolver : IValueResolver<Submission, SubmissionServiceModel, int>
{
    public int Resolve(Submission source, SubmissionServiceModel destination, int destMember, ResolutionContext context)
    {
        var submissionTypeInProblem = source.Problem.SubmissionTypesInProblems.FirstOrDefault(stp =>
            stp.SubmissionTypeId == source.SubmissionTypeId);

        if (submissionTypeInProblem != null && submissionTypeInProblem.TimeLimit.HasValue)
        {
            return submissionTypeInProblem.TimeLimit.Value;
        }

        return source.Problem.TimeLimit;
    }
}