namespace OJS.Data.Models
{
    using OJS.Data.Models.Problems;

    public class TagInProblem
    {
        public int TagId { get; set; }

        public virtual Tag? Tag { get; set; }

        public int ProblemId { get; set; }

        public virtual Problem? Problem { get; set; }
    }
}