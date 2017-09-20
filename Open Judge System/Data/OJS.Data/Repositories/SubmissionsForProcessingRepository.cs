namespace OJS.Data.Repositories
{
    using System.Linq;

    using MongoDB.Bson;
    using MongoDB.Driver;

    using OJS.Data.Models;
    using OJS.Data.Repositories.Base;
    using OJS.Data.Repositories.Contracts;

    public class SubmissionsForProcessingRepository :
        GenericMongoRepository<SubmissionForProcessing, ObjectId>, ISubmissionsForProcessingRepository
    {
        public SubmissionsForProcessingRepository(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public void AddOrUpdate(int submissionId)
        {
            var submissionForProcessing = this.All().FirstOrDefault(s => s.SubmissionId == submissionId);

            if (submissionForProcessing != null)
            {
                submissionForProcessing.Processing = false;
                submissionForProcessing.Processed = false;
                this.Update(submissionForProcessing);
            }
            else
            {
                submissionForProcessing = new SubmissionForProcessing()
                {
                    SubmissionId = submissionId,
                    Processed = false,
                    Processing = false
                };
                this.Add(submissionForProcessing);
            }
        }

        public void Remove(int submissionId)
        {
            var submissionForProcessing = this.All().FirstOrDefault(s => s.SubmissionId == submissionId);

            if (submissionForProcessing != null)
            {
                this.Delete(submissionForProcessing.Id);
            }
        }

        public void DeleteAllProcessed()
        {
            this.Delete(x => x.Processed);
        }
    }
}
