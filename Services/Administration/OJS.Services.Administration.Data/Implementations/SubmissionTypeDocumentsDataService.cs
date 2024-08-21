namespace OJS.Services.Administration.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Data;
using OJS.Data.Models.Submissions;
using System.Linq;

public class SubmissionTypeDocumentsDataService : AdministrationDataService<SubmissionTypeDocument>, ISubmissionTypeDocumentsDataService
{
    public SubmissionTypeDocumentsDataService(OjsDbContext db)
        : base(db)
    {
    }
}