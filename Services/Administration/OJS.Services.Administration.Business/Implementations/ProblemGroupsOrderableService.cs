namespace OJS.Services.Administration.Business.Implementations;

using OJS.Data.Models.Problems;
using FluentExtensions.Extensions;
using System.Linq;
using Data;
using System.Collections.Generic;
using System.Threading.Tasks;

public class ProblemGroupsOrderableService : IOrderableService<ProblemGroup>
{
    private readonly IProblemGroupsDataService problemGroupsData;

    public ProblemGroupsOrderableService(IProblemGroupsDataService problemGroupsData)
        => this.problemGroupsData = problemGroupsData;

    public async Task ReevaluateOrderBy(IEnumerable<ProblemGroup> entities)
    {
        var orderByIndex = 0;

        entities
            .Where(p => !p.IsDeleted)
            .OrderBy(p => p.OrderBy)
            .ForEach(p =>
            {
                p.OrderBy = ++orderByIndex;
                this.problemGroupsData.Update(p);
            });

        await this.problemGroupsData.SaveChanges();
    }
}