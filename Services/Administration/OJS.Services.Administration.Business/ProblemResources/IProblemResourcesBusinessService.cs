namespace OJS.Services.Administration.Business.ProblemResources;

using OJS.Data.Models.Problems;
using OJS.Services.Administration.Models.ProblemResources;
using System.Threading.Tasks;

public interface IProblemResourcesBusinessService : IAdministrationOperationService<ProblemResource, int, ProblemResourceAdministrationModel>
{
    Task<ResourceServiceModel> GetResourceFile(int id);
}