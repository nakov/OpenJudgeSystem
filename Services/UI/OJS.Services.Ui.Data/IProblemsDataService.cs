namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data.Infrastructure;
    using System.Threading.Tasks;

    public interface IProblemsDataService : IDataService<Problem>
    {
        Task<Problem> GetWithProblemGroupCheckerAndTestsById(int id);
    }
}