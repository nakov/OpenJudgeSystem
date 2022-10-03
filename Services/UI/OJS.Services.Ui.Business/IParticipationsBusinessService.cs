using SoftUni.Services.Infrastructure;

namespace OJS.Services.Ui.Business
{
    using OJS.Services.Ui.Models.Participations;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IParticipationsBusinessService : IService
    {
        Task<IEnumerable<ParticipationServiceModel>> GetParticipationsByUserId(string? userId);
    }
}