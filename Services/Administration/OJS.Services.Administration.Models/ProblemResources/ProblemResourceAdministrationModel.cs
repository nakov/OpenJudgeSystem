namespace OJS.Services.Administration.Models.ProblemResources;

using AutoMapper;
using Microsoft.AspNetCore.Http;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Data.Models.Problems;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class ProblemResourceAdministrationModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public string Name { get; set; } = string.Empty;

    public ProblemResourceType? Type { get; set; }

    public IFormFile? File { get; set; }

    public string? FileExtension { get; set; }

    public string? Link { get; set; }

    public double OrderBy { get; set; }

    public int ProblemId { get; set; }

    public bool HasFile { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<ProblemResource, ProblemResourceAdministrationModel>()
            .ForMember(d => d.HasFile, opt
                => opt.MapFrom(s => s.File != null))
            .ForMember(d => d.OperationType, opt
                => opt.Ignore())
            .ForMember(d => d.File, opt
                => opt.Ignore());

        configuration.CreateMap<ProblemResourceAdministrationModel, ProblemResource>()
            .ForMember(d => d.File, opt
                => opt.MapFrom(s => s.File == null ? null : s.File.GetBytes()))
            .ForMember(d => d.IsDeleted, opt
                => opt.Ignore())
            .ForMember(d => d.DeletedOn, opt
                => opt.Ignore())
            .ForMember(d => d.CreatedOn, opt
                => opt.Ignore())
            .ForMember(d => d.ModifiedOn, opt
                => opt.Ignore())
            .ForMember(d => d.Problem, opt
                => opt.Ignore())
            .AfterMap((s, d) =>
            {
                /*
                 * AutoMapper cannot automatically map the File property to null
                 * when it's an empty byte array. Therefore, we explicitly check
                 * after the mapping process if the File is either null or an empty
                 * array, and if so, we set it to null manually.
                 */
                if (s.File == null || s.File.Length == 0)
                {
                    d.File = null;
                }
            });
    }
}