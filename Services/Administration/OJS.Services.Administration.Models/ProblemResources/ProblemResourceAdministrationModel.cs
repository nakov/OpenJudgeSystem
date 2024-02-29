namespace OJS.Services.Administration.Models.ProblemResources;

using AutoMapper;
using Microsoft.AspNetCore.Http;
using OJS.Common.Extensions;
using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.IO;
using Microsoft.AspNetCore.Http.Internal;

public class ProblemResourceAdministrationModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public string Name { get; set; } = string.Empty;

    public string? Type { get; set; }

    public byte[]? File { get; set; }

    public string? FileExtension { get; set; }

    public string? Link { get; set; }

    public double OrderBy { get; set; }

    public bool HasFile { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<ProblemResource, ProblemResourceAdministrationModel>()
            .ForMember(pram => pram.HasFile, opt
                => opt.MapFrom(pr => pr.File != null));

        configuration.CreateMap<ProblemResourceAdministrationModel, ProblemResource>()
            .ForMember(pr => pr.IsDeleted, opt
                => opt.Ignore())
            .ForMember(pr => pr.DeletedOn, opt
                => opt.Ignore())
            .ForMember(pr => pr.CreatedOn, opt
                => opt.Ignore())
            .ForMember(pr => pr.ModifiedOn, opt
            => opt.Ignore())
            .ForMember(pr => pr.Problem, opt
                => opt.Ignore())
            .ForMember(pr => pr.ProblemId, opt
                => opt.Ignore());
    }
}