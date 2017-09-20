namespace OJS.Data.Repositories.Contracts
{
    using MongoDB.Bson;

    using OJS.Data.Models;
    using OJS.Data.Repositories.Base;

    public interface ISubmissionsForProcessingRepository : IMongoRepository<SubmissionForProcessing, ObjectId>
    {
        void AddOrUpdate(int submissionId);

        void Remove(int submissionId);

        void DeleteAllProcessed();
    }
}
