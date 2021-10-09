namespace OJS.Services.Busines.Submissions.Models
{
    using System.Collections.Generic;

    public class TaskResultResponseModel
    {
        public int Points { get; set; }

        public IEnumerable<TestResultResponseModel> TestResults { get; set; }
    }
}