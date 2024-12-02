namespace OJS.Services.Administration.Data
{
    using System.Linq;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data;
    using OJS.Services.Infrastructure;

    public interface ISubmissionTypesDataService : IService, IDataService<SubmissionType>
    {
        IQueryable<SubmissionType> GetAll();
    }
}