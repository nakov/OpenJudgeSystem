namespace OJS.Services.Ui.Business
{
    using System.Threading.Tasks;
    using SoftUni.Services.Infrastructure;

    public interface ISubmissionsForProcessingBusinessService : IService
    {
        Task ResetAllProcessingSubmissions();
    }
}