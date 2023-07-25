﻿namespace OJS.Servers.Ui.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using Models.SubmissionTypes;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Services.Ui.Business.Cache;
using OJS.Servers.Infrastructure.Extensions;
using static Microsoft.AspNetCore.Http.StatusCodes;
using OJS.Servers.Infrastructure.Controllers;

public class SubmissionTypesController : BaseApiController
{
    private readonly ISubmissionTypesCacheService submissionTypesCache;

    public SubmissionTypesController(
        ISubmissionTypesCacheService submissionTypesCache)
        => this.submissionTypesCache = submissionTypesCache;

    /// <summary>
    /// Gets all submission types ordered by most used to least.
    /// </summary>
    /// <returns>A collection of all submission types.</returns>
    /// <remarks>
    /// Usage is determined by gathering information from latest submissions.
    /// </remarks>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<SubmissionTypeFilterResponseModel>), Status200OK)]
    public async Task<IActionResult> GetAllOrderedByLatestUsage()
        => await this.submissionTypesCache
            .GetAllOrderedByLatestUsage()
            .MapCollection<SubmissionTypeFilterResponseModel>()
            .ToOkResult();
}