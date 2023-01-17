namespace OJS.Services.Administration.Models.Tests;

using System.Collections.Generic;

public class TestsParseResult
{
    public List<string> OpenInputs { get; set; } = new ();

    public List<string> OpenOutputs { get; set; } = new ();

    public List<string> ZeroInputs { get; set; } = new ();

    public List<string> ZeroOutputs { get; set; } = new ();

    public List<string> Inputs { get; set; } = new ();

    public List<string> Outputs { get; set; } = new ();
}