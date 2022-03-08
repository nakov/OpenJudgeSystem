﻿using OJS.Common;
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

public class SubmissionTypesBusinessService : ISubmissionTypesBusinessService
{
    private ISubmissionTypesDataService submissionTypesDataService;

    public SubmissionTypesBusinessService(ISubmissionTypesDataService submissionTypesDataService)
        => this.submissionTypesDataService = submissionTypesDataService;

    public Task<SubmissionTypeServiceModel> GetById(int id) => throw new System.NotImplementedException();

    public async Task<IEnumerable<SubmissionTypeServiceModel>> GetAllowedSubmissionTypes(int problemId)
        => await this.submissionTypesDataService
            .GetAllByProblem(problemId)
            .MapCollection<SubmissionTypeServiceModel>()
            .ToListAsync();

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