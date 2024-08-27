﻿namespace OJS.Services.Administration.Models.ProblemResources;

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
            .ForMember(pram => pram.HasFile, opt
                => opt.MapFrom(pr => pr.File != null))
            .ForMember(pram => pram.OperationType, opt
                => opt.Ignore())
            .ForMember(pram => pram.File, opt
                => opt.Ignore());

        configuration.CreateMap<ProblemResourceAdministrationModel, ProblemResource>()
            .ForMember(pr => pr.File, opt
                => opt.MapFrom(pram => pram.File == null ? null : pram.File.GetBytes()))
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
            .AfterMap((pram, pr) =>
            {
                /*
                 * AutoMapper cannot automatically map the File property to null
                 * when it's an empty byte array. Therefore, we explicitly check
                 * after the mapping process if the File is either null or an empty
                 * array, and if so, we set it to null manually.
                 */
                if (pram.File == null || pram.File.Length == 0)
                {
                    pr.File = null;
                }
            });
    }
}