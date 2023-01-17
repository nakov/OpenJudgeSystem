namespace OJS.Services.Ui.Business
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using OJS.Services.Ui.Models.Participations;
    using SoftUni.Services.Infrastructure;

    public interface IParticipationsBusinessService : IService
    {
        Task<IEnumerable<ParticipationServiceModel>> GetParticipationsByUserId(string? userId);
    }
}