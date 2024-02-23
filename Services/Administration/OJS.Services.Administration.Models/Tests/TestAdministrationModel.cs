namespace OJS.Services.Administration.Models.Tests;

using AutoMapper;
using OJS.Data.Models.Tests;
using SoftUni.AutoMapper.Infrastructure.Models;

public class TestAdministrationModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public bool IsTrialTest { get; set; }

    public bool IsOpenTest { get; set; }

    public bool HideInput { get; set; }

    public string? Input { get; set; }

    public string? Output { get; set; }

    public string? Type { get; set; }

    public double OrderBy { get; set; }

    public int ProblemId { get; set; }

    public string? ProblemName { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Test, TestAdministrationModel>()
            .ForMember(
                tam => tam.Input,
                opt => opt.MapFrom(d => d.InputDataAsString))
            .ForMember(
                tam => tam.Output,
                opt => opt.MapFrom(d => d.InputDataAsString))
            .ForMember(
                tam => tam.Type,
                opt => opt.MapFrom(t
                    => MapTestType(t.IsTrialTest, t.IsOpenTest)));

    private static string? MapTestType(bool isTrialTest, bool isOpenTest) =>
        isOpenTest
            ? TestTypeEnum.Compete.ToString()
            : isTrialTest
                ? TestTypeEnum.Practice.ToString()
                : TestTypeEnum.Standard.ToString();
}
