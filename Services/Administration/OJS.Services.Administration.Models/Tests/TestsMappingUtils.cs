namespace OJS.Services.Administration.Models.Tests;

public static class TestsMappingUtils
{
    public static string MapTestType(bool isTrialTest, bool isOpenTest)
        => isOpenTest
            ? TestTypeEnum.Open.ToString()
            : isTrialTest
                ? TestTypeEnum.Trial.ToString()
                : TestTypeEnum.Standard.ToString();
}