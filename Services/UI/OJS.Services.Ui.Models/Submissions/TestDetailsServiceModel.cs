namespace OJS.Services.Ui.Models.Submissions;

using AutoMapper;
using OJS.Data.Models.Tests;
using OJS.Services.Infrastructure.Models.Mapping;

public class TestDetailsServiceModel : IMapExplicitly
{
    public int Id { get; set; }

    public bool IsTrialTest { get; set; }

    public bool IsOpenTest { get; set; }

    public bool HideInput { get; set; }

    public byte[]? InputData { get; set; }

    public double OrderBy { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<Test, TestDetailsServiceModel>()
            .ForMember(m => m.InputData,
                opt => opt.MapFrom(src => src.IsTrialTest && !src.HideInput
                    ? src.InputData
                    : null));
}