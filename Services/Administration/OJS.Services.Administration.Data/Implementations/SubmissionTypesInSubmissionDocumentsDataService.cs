namespace OJS.Services.Administration.Data.Implementations;

using OJS.Data;
using OJS.Data.Models;

public class SubmissionTypesInSubmissionDocumentsDataService : AdministrationDataService<SubmissionTypeInSubmissionDocument>, ISubmissionTypesInSubmissionDocumentsDataService
{
    public SubmissionTypesInSubmissionDocumentsDataService(OjsDbContext db)
        : base(db)
    {
    }
}