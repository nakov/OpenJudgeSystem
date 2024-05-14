namespace OJS.Services.Administration.Business.Checkers;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Checkers;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Checkers;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using System.Threading.Tasks;

public class CheckersBusinessService : AdministrationOperationService<Checker, int, CheckerAdministrationModel>, ICheckersBusinessService
{
    private readonly ICheckersDataService checkersDataService;

    public CheckersBusinessService(ICheckersDataService checkersDataService)
        => this.checkersDataService = checkersDataService;

    public override Task<CheckerAdministrationModel> Get(int id)
        => this.GetCheckerById(id).Map<CheckerAdministrationModel>();

    public override async Task<CheckerAdministrationModel> Create(CheckerAdministrationModel model)
    {
        var checker = model.Map<Checker>();

        await this.checkersDataService.Add(checker);
        await this.checkersDataService.SaveChanges();

        return model;
    }

    public override async Task<CheckerAdministrationModel> Edit(CheckerAdministrationModel model)
    {
        var checker = await this.GetCheckerById(model.Id);
        if (checker == null)
        {
            throw new BusinessServiceException("Checker not found.");
        }

        checker.MapFrom(model);
        this.checkersDataService.Update(checker);
        await this.checkersDataService.SaveChanges();

        return model;
    }

    public override async Task Delete(int id)
    {
       var checker = await this.GetCheckerById(id);

       this.checkersDataService.Delete(checker);
       await this.checkersDataService.SaveChanges();
    }

    private async Task<Checker> GetCheckerById(int id)
    {
        var checker = await this.checkersDataService.GetByIdQuery(id).FirstOrDefaultAsync();
        if (checker == null)
        {
            throw new BusinessServiceException("Checker not found.");
        }

        return checker;
    }
}