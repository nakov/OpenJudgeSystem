namespace OJS.Web.Controllers
{
    using System.Diagnostics;
    using System.Linq;
    using System.Web.Mvc;

    using Kendo.Mvc.Extensions;
    using Kendo.Mvc.UI;

    using Newtonsoft.Json;

    using OJS.Common;
    using OJS.Data;
    using OJS.Services.Busines.Submissions.Models;
    using OJS.Services.Business.Submissions;
    using OJS.Services.Data.Submissions;
    using OJS.Services.Data.SubmissionsForProcessing;
    using OJS.Web.Common.Extensions;
    using OJS.Web.Models.Submissions;
    using OJS.Web.ViewModels.Submission;
    using OJS.Workers.Common;

    using static OJS.Web.Common.WebConstants;

    public class SubmissionsController : BaseController
    {
        private readonly ISubmissionsBusinessService submissionsBusiness;
        private readonly ISubmissionsDataService submissionsData;
        private readonly ISubmissionsForProcessingDataService submissionsForProcessingData;

        public SubmissionsController(
            IOjsData data,
            ISubmissionsBusinessService submissionsBusiness,
            ISubmissionsDataService submissionsData,
            ISubmissionsForProcessingDataService submissionsForProcessingData)
            : base(data)
        {
            this.submissionsBusiness = submissionsBusiness;
            this.submissionsData = submissionsData;
            this.submissionsForProcessingData = submissionsForProcessingData;
        }

        public ActionResult Index()
        {
            if (this.User.IsAdmin())
            {
                this.ViewBag.SubmissionsInQueue = this.Data.Submissions.All().Count(x => !x.Processed);
            }
            else
            {
                var latestSubmissionId = this.submissionsData.GetAll().Max(s => s.Id);

                // using Id for better performance since it is only for displaying purposes
                this.ViewBag.TotalSubsmissionsCount = latestSubmissionId;
            }

            return this.View("AdvancedSubmissions");
        }

        public ActionResult GetSubmissionsGrid(
            bool notProcessedOnly = false,
            string userId = null,
            int? contestId = null)
        {
            var filter = new SubmissionsFilterViewModel
            {
                ContestId = contestId,
                UserId = userId,
                NotProcessedOnly = this.User.IsAdmin() && notProcessedOnly
            };

            return this.PartialView("_AdvancedSubmissionsGridPartial", filter);
        }

        [HttpPost]
        public ActionResult ReadSubmissions(
            [DataSourceRequest]DataSourceRequest request,
            bool notProcessedOnly = false,
            int? contestId = null)
        {
            var data = this.submissionsData.GetAll();

            var userIsAdmin = this.User.IsAdmin();
            var userIsLecturer = this.User.IsLecturer();
            var userIsAdminOrLecturer = userIsAdmin || userIsLecturer;

            if (userIsLecturer && !userIsAdmin)
            {
                data = this.submissionsData.GetAllFromContestsByLecturer(this.UserProfile.Id);
            }

            // For regular users return only one page of submissions
            if (!userIsAdminOrLecturer)
            {
                data = data.OrderByDescending(s => s.CreatedOn).Take(AdvancedSubmissionsGridPageSize);
            }

            // NotProcessedOnly filter is available only for administrators
            if (userIsAdmin && notProcessedOnly)
            {
                data = data.Where(s => !s.Processed);
            }

            if (contestId.HasValue)
            {
                data = data.Where(s => s.Problem.ProblemGroup.ContestId == contestId.Value);
            }

            var result = userIsAdminOrLecturer
                ? data.Select(SubmissionViewModel.FromSubmission)
                : data.Select(SubmissionViewModel.FromSubmissionWithoutTestRuns);

            var serializationSettings = new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore };
            var json = JsonConvert.SerializeObject(result.ToDataSourceResult(request), Formatting.None, serializationSettings);
            return this.Content(json, GlobalConstants.JsonMimeType);
        }

        [HttpPost]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        [ValidateAntiForgeryToken]
        public ActionResult StartOjsLocalWorkerService()
        {
            var processStartInfo = new ProcessStartInfo
            {
                UseShellExecute = false,
                WindowStyle = ProcessWindowStyle.Hidden,
                RedirectStandardError = true,
                RedirectStandardOutput = true,
                CreateNoWindow = true,
                ErrorDialog = false,
                FileName = "cmd",
                Arguments = @"/c SCHTASKS.EXE /RUN /TN JudgeTasks\RestartService"
            };

            using (var cmdProcess = Process.Start(processStartInfo))
            {
                if (cmdProcess == null)
                {
                    this.TempData.AddDangerMessage("Couldn't start process.");
                }
                else
                {
                    cmdProcess.StartInfo = processStartInfo;
                    cmdProcess.Start();
                    cmdProcess.WaitForExit(Constants.DefaultProcessExitTimeOutMilliseconds);

                    var error = cmdProcess.StandardError.ReadToEnd();
                    if (string.IsNullOrWhiteSpace(error))
                    {
                        this.TempData.AddInfoMessage("The service was started successfully!");
                    }
                    else
                    {
                        this.TempData.AddDangerMessage("The service is already running or an error has occurred while starting it.");
                    }
                }
            }

            return this.RedirectToAction<SubmissionsController>(c => c.Index());
        }

        // TODO: restrict this endpoint to be available only to the distributor
        [HttpPost]
        public ActionResult SaveExecutionResult(SubmissionExecutionResult submissionExecutionResult)
        {
            this.submissionsBusiness.ProcessExecutionResult(submissionExecutionResult);

            return this.Json(new SaveExecutionResultResponseModel
            {
                SubmissionId = submissionExecutionResult.SubmissionId,
            });
        }
    }
}