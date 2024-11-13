namespace OJS.Services.Administration.Business.ProblemResources;

using OJS.Data.Models.Problems;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ProblemResources;
using OJS.Services.Infrastructure.Extensions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Common;
using System.Linq;

public class ProblemResourceBusinessService : AdministrationOperationService<ProblemResource, int, ProblemResourceAdministrationModel>, IProblemResourcesBusinessService
{
    private readonly IProblemResourcesDataService problemResourcesDataService;
    private readonly IProblemsDataService problemsData;
    private readonly IProblemsCacheService problemsCache;

    public ProblemResourceBusinessService(
        IProblemResourcesDataService problemResourcesDataService,
        IProblemsDataService problemsData,
        IProblemsCacheService problemsCache)
    {
        this.problemResourcesDataService = problemResourcesDataService;
        this.problemsData = problemsData;
        this.problemsCache = problemsCache;
    }

    public override async Task Delete(int id)
    {
        var problemResource = await this.problemResourcesDataService
            .GetByIdQuery(id)
            .Select(pr => new { pr.Problem.ProblemGroup.ContestId, pr.ProblemId})
            .FirstAsync();

        await this.problemResourcesDataService.DeleteById(id);
        await this.problemResourcesDataService.SaveChanges();

        await this.problemsCache.ClearProblemCacheById(problemResource.ProblemId);
    }

    public override async Task<ProblemResourceAdministrationModel> Create(ProblemResourceAdministrationModel model)
    {
        var problemResource = model.Map<ProblemResource>();

        if (model.File != null)
        {
            AssignFileExtension(problemResource, model.File.FileName);
        }

        await this.problemResourcesDataService.Add(problemResource);
        await this.problemResourcesDataService.SaveChanges();

        await this.problemsCache.ClearProblemCacheById(problemResource.ProblemId);

        return model;
    }

    public override async Task<ProblemResourceAdministrationModel> Get(int id)
        => await this.problemResourcesDataService.GetByIdQuery(id).FirstOrDefaultAsync().Map<ProblemResourceAdministrationModel>();

    public override async Task<ProblemResourceAdministrationModel> Edit(ProblemResourceAdministrationModel model)
    {
        var resource = await this.problemResourcesDataService.GetByIdQuery(model.Id)
            .Include(pr => pr.Problem)
            .FirstOrDefaultAsync();

        var areFileAndLinkNull = model is { File: null, Link: null };

        if (resource is null)
        {
            throw new BusinessServiceException($"Resource with id {model.Id} not found.");
        }

        if (resource is { File: null } && areFileAndLinkNull)
        {
            // This will be valid when we want to switch from a link to a file-based resource.
            throw new BusinessServiceException("The file cannot be empty.");
        }

        // Get the value before mapping from the model.
        var shouldKeepFile = resource is { File: not null } && areFileAndLinkNull;

        resource.MapFrom(model);

        /*
        * When updating a problem resource, the file is not sent from the frontend to avoid unnecessary data transfer
        * and complex comparisons. If a file already exists on the backend and the current problem resource type
        * is not 'Link' (i.e., we're not switching from a file-based resource to a link), we want to retain the file
        * and avoid deleting or nullifying it.
        */
        if (shouldKeepFile)
        {
            var entry = this.problemResourcesDataService.GetEntry(resource);

            entry.Property(pr => pr.File).IsModified = false;
            entry.Property(pr => pr.FileExtension).IsModified = false;
        }

        if (model.File != null)
        {
            AssignFileExtension(resource, model.File.FileName);
        }

        this.problemResourcesDataService.Update(resource);
        await this.problemResourcesDataService.SaveChanges();

        await this.problemsCache.ClearProblemCacheById(resource.ProblemId);

        return model;
    }

    public async Task<ResourceServiceModel> GetResourceFile(int id)
    {
        var hasResource = await this.problemResourcesDataService.ExistsById(id);
        if (!hasResource)
        {
            throw new BusinessServiceException("Resource not found.");
        }

        var resource = await this.problemResourcesDataService.GetByIdQuery(id)
            .Include(x => x.Problem)
            .FirstAsync();

        return new ResourceServiceModel
        {
            Content = resource.File!,
            MimeType = GlobalConstants.MimeTypes.ApplicationOctetStream,
            FileName = string.Format($"Resource-{resource.Id}-{resource.Problem.Name}.{resource.FileExtension}"),
        };
    }

    private static void AssignFileExtension(ProblemResource resource, string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName) || !fileName.Contains('.'))
        {
            throw new BusinessServiceException("Invalid file name or no extension found.", nameof(fileName));
        }

        var extension = fileName.Substring(fileName.LastIndexOf('.') + 1);

        if (string.IsNullOrWhiteSpace(extension) || !extension.All(char.IsLetterOrDigit))
        {
            throw new BusinessServiceException("Invalid file extension.", nameof(fileName));
        }

        resource!.FileExtension = extension;
    }
}