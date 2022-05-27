namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data.Implementations;
    using OJS.Services.Infrastructure.Extensions;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class SubmissionTypesDataService : DataService<SubmissionType>, ISubmissionTypesDataService
    {
        public SubmissionTypesDataService(OjsDbContext db) : base(db)
        {
        }

        public IQueryable<SubmissionType> GetAllByProblem(int problemId)
            => this.GetQuery()
                .Where(st => st.SubmissionTypesInProblems
                    .Any(p => p.ProblemId == problemId));

        public Task<IEnumerable<TServiceModel>> GetAllOrderedByMostUsed<TServiceModel>()
            => this.GetQuery(
                    orderBy: x => x.SubmissionTypesInProblems.Count(stp => !stp.Problem.IsDeleted),
                    descending: true)
                .MapCollection<TServiceModel>()
                .ToEnumerableAsync();
    }
}