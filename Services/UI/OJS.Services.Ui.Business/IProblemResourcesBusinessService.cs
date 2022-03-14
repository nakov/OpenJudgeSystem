using OJS.Services.Ui.Models.Problems;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

namespace OJS.Services.Ui.Business;

public interface IProblemResourcesBusinessService : IService
{
    Task<ProblemResourceServiceModel> GetResource(int resourceId);
}