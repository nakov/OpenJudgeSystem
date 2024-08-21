namespace OJS.Services.Administration.Models.SubmissionTypeDocuments;

using AutoMapper;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Models.SubmissionTypesInSubmissionDocuments;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure.Models.Mapping;
using System.Collections.Generic;
using System.Linq;

public class SubmissionTypeDocumentAdministrationModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public double OrderBy { get; set; }

    public ICollection<SubmissionTypeInSubmissionDocumentAdministrationModel> SubmissionTypesInSubmissionDocuments { get; set; } = null!;

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration
            .CreateMap<SubmissionTypeDocument, SubmissionTypeDocumentAdministrationModel>()
            .ForMember(
                dest => dest.Id,
                opt => opt
                    .MapFrom(s => s.Id))
            .ForMember(
                dest => dest.Title,
                opt => opt
                    .MapFrom(s => s.Title))
            .ForMember(
                dest => dest.Content,
                opt => opt
                    .MapFrom(s => s.Content))
            .ForMember(
                dest => dest.OrderBy,
                opt => opt.MapFrom(s => s.OrderBy))
            .ForMember(
                dest => dest.SubmissionTypesInSubmissionDocuments,
                opt => opt
                    .MapFrom(s => s.SubmissionTypesInSubmissionDocuments.Select(stsd => new SubmissionTypeInSubmissionDocumentAdministrationModel
                    {
                        SubmissionTypeId = stsd.SubmissionTypeId,
                        SubmissionTypeDocumentId = stsd.SubmissionTypeDocumentId,
                    })))
            .ForMember(
                dest => dest.OperationType,
                opt => opt
                    .Ignore());

        configuration
            .CreateMap<SubmissionTypeDocumentAdministrationModel, SubmissionTypeDocument>()
            .ForMember(
                dest => dest.DeletedOn,
                opt => opt
                    .Ignore())
            .ForMember(
                dest => dest.IsDeleted,
                opt => opt
                    .Ignore())
            .ForMember(
                dest => dest.CreatedOn,
                opt => opt
                    .Ignore())
            .ForMember(
                dest => dest.ModifiedOn,
                opt => opt
                    .Ignore());
    }
}