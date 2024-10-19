namespace OJS.Services.Ui.Models.Contests;

using AutoMapper;
using Data.Models;
using Data.Models.Checkers;
using Data.Models.Contests;
using Data.Models.Problems;
using Data.Models.Submissions;
using Data.Models.Tests;
using Infrastructure.Models.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;

public class ContestLegacyExportServiceModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; }

    public bool IsVisible { get; set; }

    public DateTime VisibleFrom { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public int CategoryId { get; set; }

    public int Type { get; set; }

    public string Duration { get; set; }

    public int LimitBetweenSubmissions { get; set; }

    public int OrderBy { get; set; }

    public int NumberOfProblemGroups { get; set; }

    public bool UsersCantSubmitConcurrently { get; set; }

    public int DefaultWorkerType { get; set; }

    public bool EnsureValidAuthorSubmisions { get; set; }

    public List<LegacyProblemGroup> ProblemGroups { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<Contest, ContestLegacyExportServiceModel>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.UsersCantSubmitConcurrently,
                opt => opt.MapFrom(src => !src.AllowParallelSubmissionsInTasks))
            .ForMember(dest => dest.DefaultWorkerType, opt => opt.MapFrom(src => 0))
            .ForMember(dest => dest.EnsureValidAuthorSubmisions, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.ProblemGroups, opt => opt.MapFrom(src => src.ProblemGroups));

        configuration.CreateMap<ProblemGroup, LegacyProblemGroup>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ContestId)) // Map ContestId to Id
            .ForMember(dest => dest.Problems, opt => opt.MapFrom(src => src.Problems));

        configuration.CreateMap<Problem, LegacyProblem>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ProblemGroupId)) // Map ProblemGroupId to Id
            .ForMember(dest => dest.Checker, opt => opt.MapFrom(src => src.Checker))
            .ForMember(dest => dest.Tests, opt => opt.MapFrom(src => src.Tests))
            .ForMember(dest => dest.SubmissionTypes, opt => opt.MapFrom(src => src.SubmissionTypesInProblems.Select(stp => stp.SubmissionType)))
            .ForMember(dest => dest.DefaultSubmissionTypeId,
                opt => opt.MapFrom(src => src.SubmissionTypesInProblems.FirstOrDefault().SubmissionTypeId))
            .ForMember(dest => dest.DefaultSubmissionType,
                opt => opt.MapFrom(src => src.SubmissionTypesInProblems.FirstOrDefault().SubmissionType));


        // Checker mapping
        configuration.CreateMap<Checker, LegacyChecker>();

        // Test mapping
        configuration.CreateMap<Test, LegacyTest>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.HideInput, opt => opt.MapFrom(src => src.HideInput));

        configuration.CreateMap<ProblemResource, LegacyResource>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString())) // Assuming Type is an enum, convert to string.
            .ForMember(dest => dest.File, opt => opt.MapFrom(src => src.File)) // Map the file byte array.
            .ForMember(dest => dest.FileExtension, opt => opt.MapFrom(src => src.FileExtension))
            .ForMember(dest => dest.Link, opt => opt.MapFrom(src => src.Link))
            .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => src.IsDeleted))
            .ForMember(dest => dest.OrderBy, opt => opt.MapFrom(src => src.OrderBy)); // Map OrderBy for sorting.

        // Submission Type mapping
        configuration.CreateMap<SubmissionType, LegacySubmissionType>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.ExecutionStrategyType, opt => opt.MapFrom(src => src.ExecutionStrategyType))
            .ForMember(dest => dest.CompilerType, opt => opt.MapFrom(src => src.CompilerType))
            .ForMember(dest => dest.FileNameExtension, opt => opt.MapFrom(src => src.FileNameExtension))
            .ForMember(dest => dest.AllowedFileExtensionsList,
                opt => opt.Ignore())
            .ForMember(dest => dest.ProblemSubmissionTypeExecutionDetails,
                opt => opt.MapFrom(src => src.SubmissionTypesInProblems));

        // ProblemSubmissionTypeExecutionDetails mapping
        configuration.CreateMap<SubmissionTypeInProblem, LegacyProblemSubmissionTypeExecutionDetail>()
            .ForMember(dest => dest.ProblemId, opt => opt.MapFrom(src => src.ProblemId))
            .ForMember(dest => dest.SubmissionTypeId, opt => opt.MapFrom(src => src.SubmissionTypeId))
            .ForMember(dest => dest.WorkerType, opt => opt.MapFrom(src => 0));
    }
}

public class LegacyProblemGroup
{
    public int Id { get; set; }

    public int ContestId { get; set; }

    public int OrderBy { get; set; }

    public List<LegacyProblem> Problems { get; set; }
}

public class LegacyProblem
{
    public int Id { get; set; }

    public string Name { get; set; }

    public int MaximumPoints { get; set; }

    public int TimeLimit { get; set; }

    public int MemoryLimit { get; set; }

    public LegacyChecker Checker { get; set; }

    public List<LegacyTest> Tests { get; set; }

    public List<LegacySubmissionType> SubmissionTypes { get; set; }

    public int DefaultSubmissionTypeId { get; set; }

    public LegacySubmissionType DefaultSubmissionType { get; set; }

    public List<LegacyResource> Resources { get; set; }
}

public class LegacyChecker
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string DllFile { get; set; }
    public string ClassName { get; set; }
}

public class LegacyTest
{
    public int Id { get; set; }
    public byte[] InputData { get; set; }
    public byte[] OutputData { get; set; }
    public bool IsTrialTest { get; set; }
    public int OrderBy { get; set; }
    public bool HideInput { get; set; }
}

public class LegacyResource
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Type { get; set; } // Assuming Type is converted to string; adjust if it's an enum.

    public byte[] File { get; set; } // Add File to map the byte array.

    public string FileExtension { get; set; } // Add FileExtension.

    public string Link { get; set; }

    public bool IsDeleted { get; set; }

    public int OrderBy { get; set; } // Add OrderBy for ordering resources.
}

public class LegacySubmissionType
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int ExecutionStrategyType { get; set; }
    public int CompilerType { get; set; }

    public string FileNameExtension { get; set; }

    public List<string> AllowedFileExtensionsList { get; set; }

    public List<LegacyProblemSubmissionTypeExecutionDetail> ProblemSubmissionTypeExecutionDetails { get; set; }
}

public class LegacyProblemSubmissionTypeExecutionDetail
{
    public int ProblemId { get; set; }
    public int SubmissionTypeId { get; set; }
    public int WorkerType { get; set; }
}