namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data;
    using System.Linq;

    public interface ISubmissionTypesDataService : IDataService<SubmissionType>
    {
        IQueryable<SubmissionType> GetAllByProblem(int problemId);
    }
}