namespace OJS.Services.Common.Extensions;

using FluentExtensions.Extensions;
using OJS.Services.Common.Models.Submissions.ExecutionContext;

public static class SubmissionServiceModelExtensions
{
    public static SubmissionServiceModel TrimDetails(this SubmissionServiceModel model)
    {
        var modelCopy = model.DeepCopy();

        // These properties hold possibly big amount of information that we don't want copied in multiple db tables
        modelCopy.FileContent = null;
        modelCopy.Code = null;

        if (modelCopy.TestsExecutionDetails != null)
        {
            modelCopy.TestsExecutionDetails.Tests = modelCopy
                .TestsExecutionDetails
                .Tests
                .Mutate(t =>
                {
                    t.Input = null;
                    t.Output = null;
                });
        }

        return modelCopy;
    }
}