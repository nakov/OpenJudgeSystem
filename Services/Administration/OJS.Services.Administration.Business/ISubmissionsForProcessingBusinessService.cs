using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

namespace OJS.Services.Administration.Business
{
    public interface ISubmissionsForProcessingBusinessService : IService
    {
        Task ResetAllProcessingSubmissions();
    }
}