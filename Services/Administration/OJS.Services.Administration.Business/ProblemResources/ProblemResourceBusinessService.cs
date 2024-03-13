namespace OJS.Services.Administration.Business.ProblemResources;

using OJS.Data.Models.Problems;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ProblemResources;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Common;
using System.Linq;

public class ProblemResourceBusinessService : AdministrationOperationService<ProblemResource, int, ProblemResourceAdministrationModel>, IProblemResourcesBusinessService
{
    private readonly IProblemResourcesDataService problemResourcesDataService;

    public ProblemResourceBusinessService(IProblemResourcesDataService problemResourcesDataService)
        => this.problemResourcesDataService = problemResourcesDataService;

    public override async Task Delete(int id)
    {
        await this.problemResourcesDataService.DeleteById(id);
        await this.problemResourcesDataService.SaveChanges();
    }

    public override async Task<ProblemResourceAdministrationModel> Create(ProblemResourceAdministrationModel model)
    {
        var problemResource = model.Map<ProblemResource>();

        await this.problemResourcesDataService.Add(problemResource);
        await this.problemResourcesDataService.SaveChanges();

        return model;
    }

    public override async Task<ProblemResourceAdministrationModel> Get(int id)
        => await this.problemResourcesDataService.GetByIdQuery(id).FirstOrDefaultAsync().Map<ProblemResourceAdministrationModel>();

    public override async Task<ProblemResourceAdministrationModel> Edit(ProblemResourceAdministrationModel model)
    {
        var resource = await this.problemResourcesDataService.GetByIdQuery(model.Id)
            .Include(pr => pr.Problem)
            .FirstOrDefaultAsync();

        if (resource is null)
        {
            throw new BusinessServiceException($"Resource with id {model.Id} not found");
        }

        resource.MapFrom(model);

        this.problemResourcesDataService.Update(resource);
        await this.problemResourcesDataService.SaveChanges();

        return model;
    }

    public async Task<ResourceServiceModel> GetResourceFile(int id)
    {
        var hasResource = await this.problemResourcesDataService.ExistsById(id);
        if (!hasResource)
        {
            throw new BusinessServiceException("Resource not found.");
        }

        var file = await this.problemResourcesDataService.GetByIdQuery(id).Select(p => new { p.File, p.FileExtension, p.Name })
            .FirstOrDefaultAsync();
        if (file == null)
        {
            throw new BusinessServiceException("File not found.");
        }

        return new ResourceServiceModel
        {
            Content = file.File!,
            MimeType = GlobalConstants.MimeTypes.ApplicationOctetStream,
            FileName = string.Format($"{file.Name}.{file.FileExtension}"),
        };
    }
}