namespace OJS.Services.Administration.Models.SubmissionTypes;

using AutoMapper;
using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionTypeAdministrationModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public string? Name { get; set; }

    public string? CompilerType { get; set; }

    public string? ExecutionStrategyType { get; set; }

    public bool IsSelectedByDefault { get; set; }

    public bool AllowBinaryFilesUpload { get; set; }

    public string? AdditionalCompilerArguments { get; set; }

    public string? AllowedFileExtensions { get; set; }

    public string? Description { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<SubmissionType, SubmissionTypeAdministrationModel>();

        configuration.CreateMap<SubmissionTypeAdministrationModel, SubmissionType>()
            .ForMember(st => st.SubmissionTypesInProblems, opt
                => opt.Ignore())
            .ForMember(st => st.AllowedFileExtensionsList, opt
                => opt.Ignore());
    }
}
