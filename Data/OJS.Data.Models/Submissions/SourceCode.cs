namespace OJS.Data.Models.Submissions
{
    using OJS.Common.Extensions.Strings;
    using OJS.Data.Infrastructure.Models;
    using OJS.Data.Models.Problems;
    using OJS.Data.Models.Users;
    using System.ComponentModel.DataAnnotations.Schema;

    public class SourceCode : DeletableAuditInfoEntity<int>
    {
        public string AuthorId { get; set; }

        public virtual UserProfile Author { get; set; }

        public int? ProblemId { get; set; }

        public virtual Problem Problem { get; set; }

        public byte[] Content { get; set; }

        [NotMapped]
        public string ContentAsString
        {
            get => this.Content.Decompress();

            set => this.Content = value.Compress();
        }

        public bool IsPublic { get; set; }
    }
}