using OJS.Common;
using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.SubmissionTypes;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using X.PagedList;

namespace OJS.Services.Ui.Business.Implementations;

using OJS.Services.Common.Data;

public class SubmissionTypesBusinessService : ISubmissionTypesBusinessService
{
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

    public async Task<IEnumerable<SubmissionTypeServiceModel>> GetAllowedSubmissionTypes(int problemId)
        => await this.submissionTypesData
            .GetAllByProblem(problemId)
            .MapCollection<SubmissionTypeServiceModel>()
            .ToListAsync();

    public async Task<IEnumerable<SubmissionTypeFilterServiceModel>> GetAll()
    {
        var submissionTypes = await this.submissionTypesData.GetQuery()
            .MapCollection<SubmissionTypeFilterServiceModel>()
            .ToListAsync();

        return submissionTypes;
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