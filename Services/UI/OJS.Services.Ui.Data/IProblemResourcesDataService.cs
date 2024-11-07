namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data;
    using OJS.Services.Infrastructure;

    public interface IProblemResourcesDataService : IDataService<ProblemResource>, IService
    {
        void DeleteByProblem(int problemId);
    }
}