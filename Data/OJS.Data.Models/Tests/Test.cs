namespace OJS.Data.Models.Tests
{
    using FluentExtensions.Extensions;
    using SoftUni.Data.Infrastructure.Models;
    using OJS.Data.Models.Problems;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations.Schema;

    public class Test : Entity<int>, IOrderableEntity
    {
        public int ProblemId { get; set; }

        public virtual Problem? Problem { get; set; }

        /// <remarks>
        /// Using byte[] (compressed with zip) to save database space.
        /// </remarks>
        public byte[] InputData { get; set; } = Array.Empty<byte>();

        [NotMapped]
        public string InputDataAsString
        {
            get => this.InputData.Decompress();

            set => this.InputData = value.Compress();
        }

        /// <remarks>
        /// Using byte[] (compressed with zip) to save database space.
        /// </remarks>
        public byte[] OutputData { get; set; } = Array.Empty<byte>();

        [NotMapped]
        public string OutputDataAsString
        {
            get => this.OutputData.Decompress();

            set => this.OutputData = value.Compress();
        }

        public bool IsTrialTest { get; set; }

        public bool IsOpenTest { get; set; }

        public bool HideInput { get; set; }

        public double OrderBy { get; set; }

        public virtual ICollection<TestRun> TestRuns { get; set; } = new HashSet<TestRun>();
    }
}