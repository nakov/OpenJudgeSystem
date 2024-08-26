namespace OJS.Services.Administration.Models.SubmissionTypeDocuments;

using AutoMapper;
using OJS.Data.Models;
using OJS.Data.Models.Submissions;
using OJS.Services.Infrastructure.Models.Mapping;
using System;
using System.Collections.Generic;

public class SubmissionTypeDocumentInListModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public int? SubmissionTypeId { get; set; }

    public string? SubmissionTypeName { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public ICollection<SubmissionTypeInSubmissionDocument> SubmissionTypesInSubmissionDocuments { get; set; } = null!;

    public void RegisterMappings(IProfileExpression configuration) =>
        configuration
            .CreateMap<SubmissionTypeDocument, SubmissionTypeDocumentInListModel>()
            .ForMember(
                dest => dest.SubmissionTypeId,
                opt => opt
                    .Ignore())
            .ForMember(
                dest => dest.SubmissionTypeName,
                opt => opt
                    .Ignore());
}