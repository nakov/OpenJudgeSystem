namespace OJS.Services.Ui.Business.Implementations;

using AutoMapper.Internal;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Models.Submissions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentExtensions.Extensions;
using OJS.Common;
using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.SubmissionTypes;

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

    public Task<SubmissionTypeServiceModel> GetById(int id)
        => this.submissionTypesData
            .OneById(id)
            .Map<SubmissionTypeServiceModel>();

    public Task<IEnumerable<SubmissionTypeServiceModel>> GetAllowedSubmissionTypes(int problemId)
        => this.submissionTypesData
            .GetAllByProblem(problemId)
            .MapCollection<SubmissionTypeServiceModel>()
            .ToEnumerableAsync();

    public async Task<IEnumerable<SubmissionTypeFilterServiceModel>> GetAllOrderedByLatestUsage()
    {
        var latestSubmissions = await this.submissionsData
            .GetLatestSubmissions<SubmissionForSubmissionTypesFilterServiceModel>(
                LatestSubmissionsCountForSubmissionTypesUsage);

        var allSubmissionTypes = await this.submissionTypesData
            .AllTo<SubmissionTypeFilterServiceModel>()
            .ToListAsync();

        var submissionTypesUsageGroups = latestSubmissions
            .GroupBy(x => x.SubmissionTypeId)
            .Where(x => x.Key.HasValue)
            .ToDictionary(x => x.Key!.Value, x => x.Count());

        return allSubmissionTypes
            .OrderByDescending(x => submissionTypesUsageGroups.GetOrDefault(x.Id));
    }

    public void ValidateSubmissionType(int submissionTypeId, Problem problem, bool shouldAllowBinaryFiles = false)
    {
        var submissionType =
            problem.SubmissionTypesInProblems.FirstOrDefault(st => st.SubmissionTypeId == submissionTypeId);
        if (submissionType == null)
        {
            throw new BusinessServiceException(Resources.ContestsGeneral.SubmissionTypeNotFound);
        }

        if (shouldAllowBinaryFiles && !submissionType.SubmissionType.AllowBinaryFilesUpload)
        {
            throw new BusinessServiceException(Resources.ContestsGeneral.BinaryFilesNotAllowed);
        }

        if (!shouldAllowBinaryFiles && submissionType.SubmissionType.AllowBinaryFilesUpload)
        {
            throw new BusinessServiceException(Resources.ContestsGeneral.TextUploadNotAllowed);
        }
    }
}