namespace OJS.Data.Models;

using OJS.Data.Models.Common;
using OJS.Data.Models.Submissions;

public class SubmissionTypeInSubmissionDocument : IEntity
{
    public int SubmissionTypeId { get; set; }

    public SubmissionType SubmissionType { get; set; } = null!;

    public int SubmissionTypeDocumentId { get; set; }

    public virtual SubmissionTypeDocument SubmissionTypeDocument { get; set; } = null!;
}