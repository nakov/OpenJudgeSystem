namespace OJS.Services.Ui.Business;

using System.Threading.Tasks;
using OJS.Services.Ui.Models.Problems;
using SoftUni.Services.Infrastructure;

public interface IProblemResourcesBusinessService : IService
{
    Task<ProblemResourceServiceModel> GetResource(int resourceId);
}