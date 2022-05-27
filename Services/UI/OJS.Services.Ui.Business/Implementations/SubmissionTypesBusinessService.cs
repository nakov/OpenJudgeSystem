using FluentExtensions.Extensions;
using OJS.Common;
using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.SubmissionTypes;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OJS.Services.Ui.Business.Implementations;

using AutoMapper.Internal;
using OJS.Common.Utils;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Models.Submissions;

public class SubmissionTypesBusinessService : ISubmissionTypesBusinessService
{
    private const int LatestSubmissionsCountForSubmissionTypesUsage = 10_000;
    private readonly ISubmissionTypesDataService submissionTypesData;
    private readonly ISubmissionsDataService submissionsData;

    public SubmissionTypesBusinessService(
        ISubmissionTypesDataService submissionTypesData,
        ISubmissionsDataService submissionsData)
    {
        this.submissionTypesData = submissionTypesData;
        this.submissionsData = submissionsData;
    }

    public Task<SubmissionTypeServiceModel> GetById(int id) => throw new System.NotImplementedException();

    public Task<IEnumerable<SubmissionTypeServiceModel>> GetAllowedSubmissionTypes(int problemId)
        => this.submissionTypesData
            .GetAllByProblem(problemId)
            .MapCollection<SubmissionTypeServiceModel>()
            .ToEnumerableAsync();

    public async Task<IEnumerable<SubmissionTypeFilterServiceModel>> GetAllOrderedByLatestUsage()
    {
        var (latestSubmissions, allSubmissionTypes) = await TasksUtils.WhenAll(
            this.submissionsData
                .GetLatestSubmissions<SubmissionForSubmissionTypesFilterServiceModel>(
                    LatestSubmissionsCountForSubmissionTypesUsage),
            this.submissionTypesData
                .AllTo<SubmissionTypeFilterServiceModel>()
                .ToListAsync());

        var submissionTypesUsageGroups = latestSubmissions
            .GroupBy(x => x.SubmissionTypeId)
            .Where(x => x.Key.HasValue)
            .ToDictionary(x => x.Key!.Value, x => x.Count());

        return allSubmissionTypes
            .OrderByDescending(x => submissionTypesUsageGroups.GetOrDefault(x.Id));
    }

    public void ValidateSubmissionType(int submissionTypeId, Problem problem, bool shouldAllowBinaryFiles = false)
    {
        var submissionType = problem.SubmissionTypesInProblems.FirstOrDefault(st => st.SubmissionTypeId == submissionTypeId);
        if (submissionType == null)
        {
            throw new BusinessServiceException(Resources.ContestsGeneral.Submission_type_not_found);
        }

        if (shouldAllowBinaryFiles && !submissionType.SubmissionType.AllowBinaryFilesUpload)
        {
            throw new BusinessServiceException(Resources.ContestsGeneral.Binary_files_not_allowed);
        }

        if (!shouldAllowBinaryFiles && submissionType.SubmissionType.AllowBinaryFilesUpload)
        {
            throw new BusinessServiceException(Resources.ContestsGeneral.Text_upload_not_allowed);
        }
    }
}