namespace OJS.Data.Models.Submissions
{
    using FluentExtensions.Extensions;
    using SoftUni.Data.Infrastructure.Models;
    using OJS.Data.Models.Problems;
    using OJS.Data.Models.Users;
    using System;
    using System.ComponentModel.DataAnnotations.Schema;

    public class SourceCode : DeletableAuditInfoEntity<int>
    {
        public string AuthorId { get; set; } = string.Empty;

        public virtual UserProfile? Author { get; set; }

        public int? ProblemId { get; set; }

        public virtual Problem? Problem { get; set; }

        public byte[] Content { get; set; } = Array.Empty<byte>();

        [NotMapped]
        public string ContentAsString
        {
            get => this.Content.Decompress();

            set => this.Content = value.Compress();
        }

        public bool IsPublic { get; set; }
    }
}