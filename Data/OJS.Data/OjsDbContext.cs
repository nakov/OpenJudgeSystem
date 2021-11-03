namespace OJS.Data
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Contracts;
    using OJS.Common.Enumerations;
    using OJS.Data.Infrastructure;
    using OJS.Data.Infrastructure.Extensions;
    using OJS.Data.Models;
    using OJS.Data.Models.Checkers;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Participants;
    using OJS.Data.Models.Problems;
    using OJS.Data.Models.Submissions;
    using OJS.Data.Models.Tests;
    using OJS.Data.Models.Users;
    using OJS.Data.Validation;

    public class OjsDbContext : BaseAuthDbContext<OjsDbContext, UserProfile>
    {
        private readonly IGlobalQueryFilterTypesCache globalQueryFilterTypesCache;

        public OjsDbContext()
        {
        }

        public OjsDbContext(
            DbContextOptions<OjsDbContext> options,
            IGlobalQueryFilterTypesCache globalQueryFilterTypesCache)
            : base(options, globalQueryFilterTypesCache)
            => this.globalQueryFilterTypesCache = globalQueryFilterTypesCache;

        public DbSet<Contest> Contests { get; set; }

        public DbSet<ExamGroup> ExamGroups { get; set; }

        public DbSet<UsersInExamGroups> UsersInExamGroups { get; set; }

        public DbSet<Problem> Problems { get; set; }

        public DbSet<ProblemGroup> ProblemGroups { get; set; }

        public DbSet<ProblemsForParticipants> ProblemsForParticipants { get; set; }

        public DbSet<Participant> Participants { get; set; }

        public DbSet<ParticipantScore> ParticipantScores { get; set; }

        public DbSet<ContestCategory> ContestCategories { get; set; }

        public DbSet<Checker> Checkers { get; set; }

        public DbSet<Test> Tests { get; set; }

        public DbSet<Submission> Submissions { get; set; }

        public DbSet<SubmissionType> SubmissionTypes { get; set; }

        public DbSet<TestRun> TestRuns { get; set; }

        public DbSet<FeedbackReport> FeedbackReports { get; set; }

        public DbSet<LecturerInContest> LecturersInContests { get; set; }

        public DbSet<LecturerInContestCategory> LecturersInContestCategories { get; set; }

        public DbSet<Ip> Ips { get; set; }

        public DbSet<AccessLog> AccessLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<UserProfile>()
                .Property(x => x.UserName)
                .IsRequired()
                .HasMaxLength(ConstraintConstants.User.UsernameMaxLength)
                .IsUnicode(false);

            builder.Entity<UserProfile>()
                .OwnsOne(x => x.UserSettings);

            builder.Entity<Ip>()
                .HasIndex(x => x.Value)
                .IsUnique();

            builder.Entity<LecturerInContest>()
                .HasKey(x => new { x.LecturerId, x.ContestId });

            builder.Entity<LecturerInContestCategory>()
                .HasKey(x => new { x.LecturerId, x.ContestCategoryId });

            builder.Entity<UsersInExamGroups>()
                .HasKey(x => new { x.UserId, x.ExamGroupId });

            builder.Entity<ProblemsForParticipants>()
                .HasKey(x => new { x.ProblemId, x.ParticipantId });

            builder.Entity<IpInContest>()
                .HasKey(x => new { x.ContestId, x.IpId });

            this.FixMultipleCascadePaths(builder);

            this.TryRegisterMatchingGlobalQueryFiltersForRequiredDeletableEntities(builder);

            base.OnModelCreating(builder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.ConfigureDbOptions(ApplicationName.Ui);

        private void FixMultipleCascadePaths(ModelBuilder builder)
        {
            builder.Entity<ProblemGroup>()
                .HasMany(p => p.Problems)
                .WithOne(c => c.ProblemGroup)
                .HasForeignKey(p => p.ProblemGroupId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Problem>()
                .HasMany(x => x.ParticipantScores)
                .WithOne(x => x.Problem)
                .HasForeignKey(x => x.ProblemId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Test>()
                .HasMany(x => x.TestRuns)
                .WithOne(x => x.Test)
                .HasForeignKey(x => x.TestId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        // Could be made a generic logic for registering Matching Query filters in BaseDbContext
        // https://docs.microsoft.com/en-us/ef/core/querying/filters#accessing-entity-with-query-filter-using-required-navigation
        private void TryRegisterMatchingGlobalQueryFiltersForRequiredDeletableEntities(ModelBuilder builder)
        {
            if (this.globalQueryFilterTypesCache == null ||
                !this.globalQueryFilterTypesCache.Contains(GlobalQueryFilterType.DeletableEntity))
            {
                return;
            }

            builder.Entity<IpInContest>()
                .HasQueryFilter(x => !x.Contest.IsDeleted);

            builder.Entity<LecturerInContest>()
                .HasQueryFilter(x => !x.Contest.IsDeleted);

            builder.Entity<LecturerInContestCategory>()
                .HasQueryFilter(x => !x.ContestCategory.IsDeleted);

            builder.Entity<Participant>()
                .HasQueryFilter(x => !x.Contest.IsDeleted);

            builder.Entity<ParticipantScore>()
                .HasQueryFilter(x => !x.Problem.IsDeleted);

            builder.Entity<ProblemsForParticipants>()
                .HasQueryFilter(x => !x.Problem.IsDeleted);

            builder.Entity<Test>()
                .HasQueryFilter(x => !x.Problem.IsDeleted);

            builder.Entity<TestRun>()
                .HasQueryFilter(x => !x.Submission.IsDeleted);
        }
    }
}