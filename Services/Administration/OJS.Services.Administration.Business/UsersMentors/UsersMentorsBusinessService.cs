namespace OJS.Services.Administration.Business.UsersMentors;

using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Mentor;
using OJS.Services.Administration.Models.UsersMentors;
using OJS.Services.Common.Data;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;

public class UsersMentorsBusinessService : IUsersMentorsBusinessService
{
    private readonly IDataService<UserMentor> userMentorData;

    public UsersMentorsBusinessService(
        IDataService<UserMentor> userMentorData)
        => this.userMentorData = userMentorData;

    public async Task<UserMentorAdministrationModel> Get(string id)
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

    public async Task<UserMentorAdministrationModel> Edit(UserMentorAdministrationModel model)
    {
        var userMentor = await this.userMentorData
            .OneById(model.Id);

        if (userMentor is null)
        {
            throw new BusinessServiceException($"The record with id #{model.Id} could not be found.");
        }

        userMentor.MapFrom(model);

        this.userMentorData.Update(userMentor);
        await this.userMentorData.SaveChanges();

        return model;
    }

    public async Task Delete(string id)
    {
        await this.userMentorData.DeleteById(id);
        await this.userMentorData.SaveChanges();
    }
}