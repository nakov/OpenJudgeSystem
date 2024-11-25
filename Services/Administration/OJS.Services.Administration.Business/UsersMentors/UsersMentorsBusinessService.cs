namespace OJS.Services.Administration.Business.UsersMentors;

using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Mentor;
using OJS.Data.Models.Users;
using OJS.Services.Administration.Models.UsersMentors;
using OJS.Services.Common.Data;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;

public class UsersMentorsBusinessService : AdministrationOperationService<UserMentor, string, UserMentorAdministrationModel>, IUsersMentorsBusinessService
{
    private readonly IDataService<UserMentor> userMentorData;
    private readonly IDataService<UserProfile> userProfileData;

    public UsersMentorsBusinessService(
        IDataService<UserMentor> userMentorData,
        IDataService<UserProfile> userProfileData)
    {
        this.userMentorData = userMentorData;
        this.userProfileData = userProfileData;
    }

    public override async Task<UserMentorAdministrationModel> Get(string id)
        => await this.userMentorData
            .GetByIdQuery(id)
            .MapCollection<UserMentorAdministrationModel>()
            .FirstAsync();

    public async Task<UserMentorAdministrationModel> Create(UserMentorAdministrationModel model)
    {
        var userMentor = model.Map<UserMentor>();

        await this.userMentorData.Add(userMentor);
        await this.userMentorData.SaveChanges();

        return model;
    }

    public override async Task<UserMentorAdministrationModel> Edit(UserMentorAdministrationModel model)
    {
        if (model.Id is null)
        {
            throw new BusinessServiceException("An invalid id was provided.");
        }

        var userMentor = await this.userMentorData
            .GetQuery(us => us.Id == model.Id)
            .FirstOrDefaultAsync();

        if (userMentor is null)
        {
            throw new BusinessServiceException($"The record with id #{model.Id} could not be found.");
        }

        this.userProfileData.Detach(userMentor.User);

        userMentor.MapFrom(model);

        this.userMentorData.Update(userMentor);
        await this.userMentorData.SaveChanges();

        return model;
    }

    public override async Task Delete(string id)
    {
        await this.userMentorData.DeleteById(id);
        await this.userMentorData.SaveChanges();
    }
}