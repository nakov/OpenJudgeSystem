namespace OJS.Services.Administration.Models.MentorPromptTemplates;

using System;
using OJS.Data.Models.Mentor;
using OJS.Services.Infrastructure.Models.Mapping;

public class MentorPromptTemplateInListModel : IMapFrom<MentorPromptTemplate>
{
    public int Id { get; set; }

    public string Title { get; set; } = default!;

    public string Template { get; set; } = default!;

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }
}