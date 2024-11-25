namespace OJS.Services.Administration.Business.MentorPromptTemplates;

using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Mentor;
using OJS.Services.Administration.Models.MentorPromptTemplates;
using OJS.Services.Common.Data;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;

public class MentorPromptTemplateBusinessService : IMentorPromptTemplateBusinessService
{
    private readonly IDataService<MentorPromptTemplate> mentorPromptTemplateData;

    public MentorPromptTemplateBusinessService(
        IDataService<MentorPromptTemplate> mentorPromptTemplateData)
        => this.mentorPromptTemplateData = mentorPromptTemplateData;


    public async Task<MentorPromptTemplateAdministrationModel> Get(int id)
        => await this.mentorPromptTemplateData
            .GetByIdQuery(id)
            .MapCollection<MentorPromptTemplateAdministrationModel>()
            .FirstAsync();

    public async Task<MentorPromptTemplateAdministrationModel> Create(MentorPromptTemplateAdministrationModel model)
    {
        var mentorPromptTemplate = model.Map<MentorPromptTemplate>();

        await this.mentorPromptTemplateData.Add(mentorPromptTemplate);
        await this.mentorPromptTemplateData.SaveChanges();

        return model;
    }

    public async Task<MentorPromptTemplateAdministrationModel> Edit(MentorPromptTemplateAdministrationModel model)
    {
        var mentorPromptTemplate = await this.mentorPromptTemplateData
            .OneById(model.Id);

        if (mentorPromptTemplate is null)
        {
            throw new BusinessServiceException($"The record with id #{model.Id} could not be found.");
        }

        mentorPromptTemplate.MapFrom(model);

        this.mentorPromptTemplateData.Update(mentorPromptTemplate);
        await this.mentorPromptTemplateData.SaveChanges();

        return model;
    }

    public async Task Delete(int id)
    {
        await this.mentorPromptTemplateData.DeleteById(id);
        await this.mentorPromptTemplateData.SaveChanges();
    }
}