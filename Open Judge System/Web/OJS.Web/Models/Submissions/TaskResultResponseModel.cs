namespace OJS.Web.Models.Submissions
{
    using System.Collections.Generic;

    public class TaskResultResponseModel
    {
        public int Points { get; set; }

        public IEnumerable<TestResultResponseModel> TestResults { get; set; }
    }
}