namespace OJS.Data.Models
{
    using MongoDB.Bson;

    using OJS.Data.Contracts;

    public class SubmissionForProcessing : IMongoEntity<ObjectId>
    {
        public ObjectId Id { get; set; }

        public int SubmissionId { get; set; }

        public bool Processing { get; set; }

        public bool Processed { get; set; }
    }
}
