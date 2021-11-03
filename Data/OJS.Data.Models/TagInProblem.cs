namespace OJS.Data.Models
{
    using OJS.Data.Models.Problems;
    using System.ComponentModel.DataAnnotations.Schema;

    public class TagInProblem
    {
        [Column("Tag_Id")]
        public int TagId { get; set; }

        public Tag Tag { get; set; }

        [Column("Problem_Id")]
        public int ProblemId { get; set; }

        public Problem Problem { get; set; }
    }
}