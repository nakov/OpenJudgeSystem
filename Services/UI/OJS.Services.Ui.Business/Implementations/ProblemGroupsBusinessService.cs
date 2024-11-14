namespace OJS.Services.Ui.Business.Implementations
{
    using OJS.Services.Ui.Data;

    public class ProblemGroupsBusinessService : IProblemGroupsBusinessService
    {
        private readonly IProblemGroupsDataService problemGroupsData;
        private readonly ISubmissionTypesDataService submissionTypesData;

        public ProblemGroupsBusinessService(
            IProblemGroupsDataService problemGroupsData,
            ISubmissionTypesDataService submissionTypesData)
        {
            this.problemGroupsData = problemGroupsData;
            this.submissionTypesData = submissionTypesData;
        }
    }
}