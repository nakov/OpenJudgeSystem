namespace OJS.Services.Administration.Business.Implementations;

using OJS.Data.Models.Problems;
using FluentExtensions.Extensions;
using System.Linq;
using Data;
using System.Collections.Generic;
using System.Threading.Tasks;

public class ProblemOrderableService : IOrderableService<Problem>
{
    private readonly IProblemsDataService problemsData;

    public ProblemOrderableService(IProblemsDataService problemsData)
        => this.problemsData = problemsData;

    public async Task ReevaluateOrderBy(IEnumerable<Problem> entities)
    {
        var orderByIndex = 0;

        entities
            .Where(p => !p.IsDeleted)
            .OrderBy(p => p.OrderBy)
            .ForEach(p =>
            {
                p.OrderBy = ++orderByIndex;
                this.problemsData.Update(p);
            });

        await this.problemsData.SaveChanges();
    }
}