namespace OJS.Services.Administration.Business
{
    using System.Threading.Tasks;
    using SoftUni.Services.Infrastructure;

    public interface ISubmissionsForProcessingBusinessService : IService
    {
        Task ResetAllProcessingSubmissions();
    }
}