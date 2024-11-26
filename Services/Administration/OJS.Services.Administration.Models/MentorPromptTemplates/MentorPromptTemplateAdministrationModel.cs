namespace OJS.Services.Administration.Models.MentorPromptTemplates;

using System;
using AutoMapper;
using OJS.Data.Models.Mentor;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class MentorPromptTemplateAdministrationModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public string Title { get; set; } = default!;

    public string Template { get; set; } = default!;

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<MentorPromptTemplate, MentorPromptTemplateAdministrationModel>()
            .ForMember(d => d.OperationType, opt => opt.Ignore())
            .ReverseMap();
}