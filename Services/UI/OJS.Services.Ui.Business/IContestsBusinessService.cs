namespace OJS.Services.Ui.Business
{
    using OJS.Services.Infrastructure;
    using OJS.Services.Ui.Models.Contests;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IContestsBusinessService : IService
    {
        Task<IEnumerable<ContestForHomeIndexServiceModel>> GetAllCompetable();

        Task<IEnumerable<ContestForHomeIndexServiceModel>> GetAllPast();
    }
}