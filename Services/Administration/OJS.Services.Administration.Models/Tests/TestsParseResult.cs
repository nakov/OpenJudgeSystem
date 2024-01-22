namespace OJS.Services.Administration.Models.Tests;

using System.Collections.Generic;

public class TestsParseResult
{
    public List<string> OpenInputs { get; set; } = [];

    public List<string> OpenOutputs { get; set; } = [];

    public List<string> ZeroInputs { get; set; } = [];

    public List<string> ZeroOutputs { get; set; } = [];

    public List<string> Inputs { get; set; } = [];

    public List<string> Outputs { get; set; } = [];
}