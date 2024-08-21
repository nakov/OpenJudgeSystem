namespace OJS.Services.Administration.Models.SubmissionTypesInSubmissionDocuments;

using AutoMapper;
using OJS.Data.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class SubmissionTypeInSubmissionDocumentAdministrationModel : IMapExplicitly
{
    public int SubmissionTypeId { get; set; }

    public int SubmissionTypeDocumentId { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration
            .CreateMap<SubmissionTypeInSubmissionDocumentAdministrationModel, SubmissionTypeInSubmissionDocument>()
            .ForMember(
                dest => dest.SubmissionTypeId,
                opt => opt
                    .MapFrom(s => s.SubmissionTypeId))
            .ForMember(
                dest => dest.SubmissionTypeDocumentId,
                opt => opt
                    .MapFrom(s => s.SubmissionTypeDocumentId))
            .ForMember(
                dest => dest.SubmissionType,
                opt => opt
                    .Ignore())
            .ForMember(
                dest => dest.SubmissionTypeDocument,
                opt => opt
                    .Ignore());

        configuration
            .CreateMap<SubmissionTypeInSubmissionDocument, SubmissionTypeInSubmissionDocumentAdministrationModel>()
            .ForMember(
                dest => dest.SubmissionTypeId,
                opt => opt
                    .MapFrom(s => s.SubmissionTypeId))
            .ForMember(
                dest => dest.SubmissionTypeDocumentId,
                opt => opt
                    .MapFrom(s => s.SubmissionTypeDocumentId));
    }
}