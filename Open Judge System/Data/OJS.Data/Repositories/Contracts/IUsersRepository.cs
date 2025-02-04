namespace OJS.Data.Repositories.Contracts
{
    using OJS.Data.Contracts;
    using OJS.Data.Models;

    public interface IUsersRepository : IDeletableEntityRepository<UserProfile>
    {
        UserProfile GetByUsername(string username);

        UserProfile GetById(string id);
    }
}
