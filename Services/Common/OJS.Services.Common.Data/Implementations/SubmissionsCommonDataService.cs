namespace OJS.Services.Common.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Submissions;
using System.Linq;

public class SubmissionsCommonDataService : DataService<Submission>, ISubmissionsCommonDataService
{
    private readonly ISubmissionsForProcessingCommonDataService submissionsForProcessingCommonDataService;

    public SubmissionsCommonDataService(
        DbContext db,
        ISubmissionsForProcessingCommonDataService submissionsForProcessingCommonDataService)
        : base(db)
        => this.submissionsForProcessingCommonDataService = submissionsForProcessingCommonDataService;

    public IQueryable<Submission> GetAllPending()
        => this.GetFromSubmissionsForProcessing(
            this.submissionsForProcessingCommonDataService.GetAllPending());

    public IQueryable<Submission> GetAllProcessing()
        => this.GetFromSubmissionsForProcessing(
            this.submissionsForProcessingCommonDataService.GetAllProcessing());

    private IQueryable<Submission> GetFromSubmissionsForProcessing(
        IQueryable<SubmissionForProcessing> submissionsForProcessing)
        => submissionsForProcessing
            .Join(
                this.DbSet,
                sfp => sfp.SubmissionId,
                submission => submission.Id,
                (sfp, submission) => submission);
}