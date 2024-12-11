namespace OJS.Data.Models.Mentor;

using System.ComponentModel.DataAnnotations;
using OJS.Data.Models.Common;
using static OJS.Data.Validation.ConstraintConstants.MentorPromptTemplate;

public class MentorPromptTemplate : AuditInfoEntity<int>
{
    [Required]
    [MinLength(TitleMinLength)]
    [MaxLength(TitleMaxLength)]
    public string Title { get; set; } = default!;

    [Required]
    public string Template { get; set; } = default!;
}