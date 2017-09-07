namespace OJS.Data.Repositories.Contracts
{
    using OJS.Data.Contracts;
    using OJS.Data.Models;

    public interface ISubmissionsForProcessingRepository
    {
        void AddOrUpdate(int submissionId);

        void Remove(int submissionId);
    }
}
