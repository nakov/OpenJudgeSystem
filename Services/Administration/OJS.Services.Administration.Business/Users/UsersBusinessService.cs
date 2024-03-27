namespace OJS.Services.Administration.Business.Users;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Users;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ExamGroups;
using OJS.Services.Administration.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Threading.Tasks;

public class UsersBusinessService : AdministrationOperationService<UserProfile, string, UserAdministrationModel>, IUsersBusinessService
{
    private readonly IUsersDataService usersDataService;

    public UsersBusinessService(IUsersDataService usersDataService)
        => this.usersDataService = usersDataService;

    public override async Task<UserAdministrationModel> Get(string id)
        => await this.usersDataService.GetByIdQuery(id)
            .MapCollection<UserAdministrationModel>()
            .AsNoTracking()
            .FirstAsync();

    public override async Task<UserAdministrationModel> Edit(UserAdministrationModel model)
    {
        var user = await this.usersDataService.GetByIdQuery(model.Id!)
            .FirstOrDefaultAsync();

        user.MapFrom(model);
        this.usersDataService.Update(user!);
        await this.usersDataService.SaveChanges();
        return model;
    }

    public Task<UserToExamGroupModel> RemoveUserFromExamGroup(UserToExamGroupModel model) => throw new System.NotImplementedException();
}