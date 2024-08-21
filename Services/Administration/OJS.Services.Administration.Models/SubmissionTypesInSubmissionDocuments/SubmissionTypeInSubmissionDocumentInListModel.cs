namespace OJS.Services.Administration.Models.SubmissionTypesInSubmissionDocuments;

using AutoMapper;
using OJS.Data.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class SubmissionTypeInSubmissionDocumentInListModel : IMapExplicitly
{
    public int SubmissionTypeId { get; set; }

    public string SubmissionTypeName { get; set; } = null!;

    public int SubmissionTypeDocumentId { get; set; }

    public string SubmissionTypeDocumentTitle { get; set; } = null!;

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration
            .CreateMap<SubmissionTypeInSubmissionDocument, SubmissionTypeInSubmissionDocumentInListModel>()
            .ForMember(
                dest => dest.SubmissionTypeName,
                opt => opt
                    .MapFrom(s => s.SubmissionType.Name))
            .ForMember(
                dest => dest.SubmissionTypeDocumentTitle,
                opt => opt
                    .MapFrom(s => s.SubmissionTypeDocument.Title));

        configuration
            .CreateMap<SubmissionTypeInSubmissionDocumentInListModel, SubmissionTypeInSubmissionDocument>()
            .ForMember(
                dest => dest.SubmissionType,
                opt => opt
                    .Ignore())
            .ForMember(
                dest => dest.SubmissionTypeDocument,
                opt => opt
                    .Ignore());
    }
}