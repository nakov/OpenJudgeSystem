namespace OJS.Data.Models
{
    using OJS.Data.Models.Problems;

    public class TagInProblem
    {
        public int TagId { get; set; }

        public Tag Tag { get; set; }

        public int ProblemId { get; set; }

        public Problem Problem { get; set; }
    }
}