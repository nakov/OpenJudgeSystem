namespace OJS.Services.Administration.Business.ExamGroups;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ExamGroups;
using OJS.Services.Infrastructure.Exceptions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Threading.Tasks;

public class ExamGroupBusinessService : AdministrationOperationService<ExamGroup, int, ExamGroupAdministrationModel>,
    IExamGroupsBusinessService
{
    private readonly IExamGroupsDataService examGroupsDataService;
    private readonly IContestsDataService contestsDataService;

    public ExamGroupBusinessService(IExamGroupsDataService examGroupsDataService, IContestsDataService contestsDataService)
    {
        this.examGroupsDataService = examGroupsDataService;
        this.contestsDataService = contestsDataService;
    }

    public override Task<ExamGroupAdministrationModel> Get(int id) =>
        this.examGroupsDataService.GetByIdQuery(id).MapCollection<ExamGroupAdministrationModel>()
            .FirstAsync();

    public override async Task<ExamGroupAdministrationModel> Create(ExamGroupAdministrationModel model)
    {
        var examGroup = model.Map<ExamGroup>();

        await this.examGroupsDataService.Add(examGroup);
        await this.examGroupsDataService.SaveChanges();

        return model;
    }

    public override async Task<ExamGroupAdministrationModel> Edit(ExamGroupAdministrationModel model)
    {
        var examGroup = await this.examGroupsDataService.GetByIdQuery(model.Id).FirstAsync();

        examGroup.MapFrom(model);

        this.examGroupsDataService.Update(examGroup);
        await this.examGroupsDataService.SaveChanges();

        return model;
    }

    public override async Task Delete(int id)
    {
        var examGroup = await this.examGroupsDataService.GetByIdQuery(id).FirstAsync();

        if (examGroup.ContestId != null && await this.contestsDataService.IsActiveById((int)examGroup.ContestId))
        {
            throw new BusinessServiceException("Cannot delete exam group from active contest.");
        }

        this.examGroupsDataService.Delete(examGroup);
        await this.examGroupsDataService.SaveChanges();
    }
}