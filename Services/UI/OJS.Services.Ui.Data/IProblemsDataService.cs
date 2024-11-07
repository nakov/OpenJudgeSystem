namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IProblemsDataService : IDataService<Problem>
    {
        Task<Problem?> GetWithSubmissionTypesById(int id);

        IQueryable<Problem> GetAllNonDeletedProblems();

        Task<Problem?> GetWithProblemGroupById(int problemId);
    }
}