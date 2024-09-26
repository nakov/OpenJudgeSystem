namespace OJS.Services.Business.Contests.Models
{
    public class ContestImportResult
    {
        public bool IsSuccess { get; set; }

        public string ErrorMessage { get; set; }

        public int NewContestId { get; set; }

        public int NewCategoryId { get; set; }

        public int ContestImportedFromId { get; set; }

        public int CategoryImportedFromId { get; set; }
    }
}