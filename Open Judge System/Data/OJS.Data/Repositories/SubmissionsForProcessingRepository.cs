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
            var submissionsForProcessing = this.Database.GetCollection<SubmissionForProcessing>("submissionsForProcessing");
            var filter = new FilterDefinitionBuilder<SubmissionForProcessing>().Where(s => s.SubmissionId == submissionId);
            var submissionForProcessing = submissionsForProcessing.Find(filter).ToList().FirstOrDefault();

            if (submissionForProcessing != null)
            {
                submissionForProcessing.Processing = false;
                submissionForProcessing.Processed = false;
            }
            else
            {
                submissionForProcessing = new SubmissionForProcessing()
                {
                    SubmissionId = submissionId,
                    Processed = false,
                    Processing = false
                };
                submissionsForProcessing.InsertOne(submissionForProcessing);
            }
        }

        public void Remove(int submissionId)
        {
            var submissionForProcessing = this.Context.SubmissionsForProcessing
                .FirstOrDefault(sfp => sfp.SubmissionId == submissionId);

            if (submissionForProcessing != null)
            {
                this.Delete(submissionForProcessing.Id);
            }
        }

  
    }
}
