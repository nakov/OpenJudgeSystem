namespace OJS.Services.Ui.Business.Implementations
{
    using OJS.Services.Common.Models;
    using OJS.Services.Ui.Data;
    using System.Linq;
    using System.Threading.Tasks;
    using Resource = OJS.Common.Resources.ProblemGroupsBusiness;

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

        public async Task<ServiceResult> DeleteById(int id)
        {
            var problemGroup = await this.problemGroupsData.OneById(id);

            if (problemGroup != null)
            {
                if (problemGroup.Problems.Any(p => !p.IsDeleted))
                {
                    return new ServiceResult(Resource.CannotDeleteProblemGroupWithProblems);
                }

                this.problemGroupsData.Delete(problemGroup);
                await this.problemGroupsData.SaveChanges();
            }

            return ServiceResult.Success;
        }
    }
}