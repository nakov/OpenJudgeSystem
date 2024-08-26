namespace OJS.Data.Models.Submissions;

using OJS.Data.Models.Common;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

using static OJS.Data.Validation.ConstraintConstants.SubmissionTypeDocuments;
public class SubmissionTypeDocument : DeletableAuditInfoEntity<int>, IOrderableEntity
{
    [Required]
    [MinLength(TitleMinLength)]
    [MaxLength(TitleMaxLength)]
    public string Title { get; set; } = null!;

    [Required]
    public string Content { get; set; } = null!;

    public double OrderBy { get; set; }

    public virtual ICollection<SubmissionTypeInSubmissionDocument> SubmissionTypesInSubmissionDocuments { get; set; } = new HashSet<SubmissionTypeInSubmissionDocument>();
}