namespace OJS.Services.Busines.Submissions.Models
{
    using OJS.Services.Ui.Models.Submissions;
    using System.Collections.Generic;

    public class TaskResultResponseModel
    {
        public int Points { get; set; }

        public IEnumerable<TestResultResponseModel> TestResults { get; set; } = null!;
    }
}