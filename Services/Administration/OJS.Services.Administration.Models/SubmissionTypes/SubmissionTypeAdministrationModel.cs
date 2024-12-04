namespace OJS.Services.Administration.Models.SubmissionTypes;

using AutoMapper;
using OJS.Data.Models.Submissions;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class SubmissionTypeAdministrationModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public string? Name { get; set; }

    public string? CompilerType { get; set; }

    public string? ExecutionStrategyType { get; set; }

    public bool AllowBinaryFilesUpload { get; set; }

    public string? AdditionalCompilerArguments { get; set; }

    public string? AllowedFileExtensions { get; set; }

    public string? Description { get; set; }

    public int? BaseTimeUsedInMilliseconds { get; set; }

    public int? BaseMemoryUsedInBytes { get; set; }

    public int? MaxAllowedTimeLimitInMilliseconds { get; set; }

    public int? MaxAllowedMemoryLimitInBytes { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<SubmissionType, SubmissionTypeAdministrationModel>()
            .ForMember(stam => stam.OperationType, opt
                => opt.Ignore());

        configuration.CreateMap<SubmissionTypeAdministrationModel, SubmissionType>()
            .ForMember(st => st.SubmissionTypesInProblems, opt
                => opt.Ignore())
            .ForMember(st => st.AllowedFileExtensionsList, opt
                => opt.Ignore())
            .ForMember(st => st.SubmissionTypesInSubmissionDocuments, opt
                => opt.Ignore());
    }
}
