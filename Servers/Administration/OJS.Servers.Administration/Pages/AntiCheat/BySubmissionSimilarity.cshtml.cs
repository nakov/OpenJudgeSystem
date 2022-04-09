namespace OJS.Servers.Administration.Pages.AntiCheat;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using OJS.Common;
using OJS.Servers.Administration.Models.AntiCheat;
using OJS.Services.Administration.Business.AntiCheat;
using OJS.Services.Administration.Business.Api;
using OJS.Services.Administration.Models.AntiCheat;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class BySubmissionSimilarity : BasePageModel
{
    private readonly IContestsApiService contestsApi;
    private readonly ISubmissionsSimilarityBusinessService submissionsSimilarityBusiness;

    public BySubmissionSimilarity(
        IContestsApiService contestsApi,
        ISubmissionsSimilarityBusinessService submissionsSimilarityBusiness)
    {
        this.contestsApi = contestsApi;
        this.submissionsSimilarityBusiness = submissionsSimilarityBusiness;
    }

    [BindProperty]
    public SubmissionSimilarityFiltersRequestModel Filters { get; set; } = new();

    public IEnumerable<SelectListItem> Contests { get; set; } = Enumerable.Empty<SelectListItem>();


    public async Task OnGet()
        => await this.PreparePageData();

    public async Task<IActionResult> OnPost()
    {
        if (!this.ModelState.IsValid)
        {
            await this.PreparePageData();
            return this.Page();
        }

        var filters = this.Filters.Map<SubmissionSimilarityFiltersServiceModel>();
        var (file, fileName) = await this.submissionsSimilarityBusiness.GetSimilaritiesForFiltersCsv(filters);

        return this.File(file, GlobalConstants.MimeTypes.Csv, fileName);
    }

    private async Task PreparePageData()
        => this.Contests = this.GetSelectListItemsFrom(
            await this.contestsApi.GetSelectListForSubmissionsSimilarity(),
            this.Filters.ContestId?.ToString());
}