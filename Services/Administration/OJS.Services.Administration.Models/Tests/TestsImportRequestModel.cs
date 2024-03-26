namespace OJS.Services.Administration.Models.Tests;

using Microsoft.AspNetCore.Http;

public class TestsImportRequestModel
{
    public int ProblemId { get; set; }

    public bool DeleteOldTests { get; set; }

    public bool RetestProblem { get; set; }

    public IFormFile? Tests { get; set; }
}