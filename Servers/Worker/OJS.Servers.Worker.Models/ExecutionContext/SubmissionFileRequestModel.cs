namespace OJS.Servers.Worker.Models.ExecutionContext;

using AutoMapper;
using Microsoft.AspNetCore.Http;
using OJS.Common.Extensions;
using System.ComponentModel.DataAnnotations;
using OJS.Services.Worker.Models.ExecutionContext;

public class SubmissionFileRequestModel : SubmissionBaseRequestModel<SubmissionFileRequestModel, string>
{
    [Required]
    public IFormFile? File { get; set; }

    protected override void MapAdditionalMembers(
        IMappingExpression<SubmissionFileRequestModel, SubmissionServiceModel> mapping)
        => mapping
            .ForMember(
                m => m.FileContent,
                opt => opt.MapFrom(src => src.File!.GetBytes()));
}
