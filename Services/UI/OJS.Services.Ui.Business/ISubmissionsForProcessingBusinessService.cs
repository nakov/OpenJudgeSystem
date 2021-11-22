using System.Threading.Tasks;

namespace OJS.Services.Ui.Business
{
    using SoftUni.Services.Infrastructure;

    public interface ISubmissionsForProcessingBusinessService : IService
    {
        Task ResetAllProcessingSubmissions();
    }
}