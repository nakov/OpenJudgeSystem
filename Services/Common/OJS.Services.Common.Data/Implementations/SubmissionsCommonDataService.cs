namespace OJS.Services.Common.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Data;
using OJS.Data.Models.Submissions;
using System.Linq;
using System.Threading.Tasks;

public class SubmissionsCommonDataService : DataService<Submission>, ISubmissionsCommonDataService
{
    private readonly ISubmissionsForProcessingCommonDataService submissionsForProcessingCommonDataService;

    public SubmissionsCommonDataService(
        OjsDbContext db,
        ISubmissionsForProcessingCommonDataService submissionsForProcessingCommonDataService)
        : base(db)
        => this.submissionsForProcessingCommonDataService = submissionsForProcessingCommonDataService;

    public IQueryable<Submission> GetAllPending()
        => this.GetFromSubmissionsForProcessing(
            this.submissionsForProcessingCommonDataService.GetAllPending());

    public IQueryable<Submission> GetAllEnqueued()
        => this.GetFromSubmissionsForProcessing(
            this.submissionsForProcessingCommonDataService.GetAllEnqueued());

    public IQueryable<Submission> GetAllProcessing()
        => this.GetFromSubmissionsForProcessing(
            this.submissionsForProcessingCommonDataService.GetAllProcessing());

    public Task<int> GetAllUnprocessedCount()
        => this.GetFromSubmissionsForProcessing(
            this.submissionsForProcessingCommonDataService.GetAllUnprocessed())
            .CountAsync();

    private IQueryable<Submission> GetFromSubmissionsForProcessing(
        IQueryable<SubmissionForProcessing> submissionsForProcessing)
        => submissionsForProcessing
            .Join(
                this.GetQuery(),
                sfp => sfp.SubmissionId,
                submission => submission.Id,
                (_, submission) => submission)
            .Where(submission => !submission.IsDeleted);
}