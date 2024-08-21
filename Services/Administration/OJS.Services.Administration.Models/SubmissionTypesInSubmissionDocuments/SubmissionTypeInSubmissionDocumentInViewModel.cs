namespace OJS.Services.Administration.Models.SubmissionTypesInSubmissionDocuments;

using System.Collections.Generic;

public class SubmissionTypeInSubmissionDocumentInViewModel
{
    public int SubmissionTypeDocumentId { get; set; }

    public string SubmissionTypeDocumentTitle { get; set; } = null!;

    public string SubmissionTypeDocumentContent { get; set; } = null!;

    public IEnumerable<string> SubmissionTypes { get; set; } = null!;
}