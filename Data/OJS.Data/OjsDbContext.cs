namespace OJS.Data
{
    using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;
    using OJS.Data.Models;
    using OJS.Data.Models.Checkers;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Participants;
    using OJS.Data.Models.Problems;
    using OJS.Data.Models.Submissions;
    using OJS.Data.Models.Tests;
    using OJS.Data.Models.Users;
    using OJS.Data.Validation;
    using SoftUni.Data.Infrastructure;
    using SoftUni.Data.Infrastructure.Enumerations;

    public class OjsDbContext : BaseAuthDbContext<OjsDbContext, UserProfile, Role, UserInRole>,
        IDataProtectionKeyContext
    {
        private readonly IGlobalQueryFilterTypesCache? globalQueryFilterTypesCache;

        // Used by AutoCrudAdmin with Activator.CreateInstance for getting Metadata about the context.
        // In OnConfiguring in memory database is used when DbContext is created from
        // the parameterless constructor, as options have to be configured, to not throw exception.
        public OjsDbContext()
        {
        }

        public OjsDbContext(DbContextOptions<OjsDbContext> options)
            : base(options)
        {
        }

        public OjsDbContext(
            DbContextOptions<OjsDbContext> options,
            IGlobalQueryFilterTypesCache globalQueryFilterTypesCache)
            : base(options, globalQueryFilterTypesCache)
            => this.globalQueryFilterTypesCache = globalQueryFilterTypesCache;

        public DbSet<DataProtectionKey> DataProtectionKeys { get; set; } = null!;

        public DbSet<Setting> Settings { get; set; } = null!;

        public DbSet<Contest> Contests { get; set; } = null!;

        public DbSet<IpInContest> ContestIps { get; set; } = null!;

        public DbSet<ExamGroup> ExamGroups { get; set; } = null!;

        public DbSet<UserInExamGroup> UsersInExamGroups { get; set; } = null!;

        public DbSet<Problem> Problems { get; set; } = null!;

        public DbSet<ProblemGroup> ProblemGroups { get; set; } = null!;

        public DbSet<ProblemResource> ProblemResources { get; set; } = null!;

        public DbSet<ProblemForParticipant> ProblemsForParticipants { get; set; } = null!;

        public DbSet<Event> Events { get; set; } = null!;

        public DbSet<Participant> Participants { get; set; } = null!;

        public DbSet<ParticipantScore> ParticipantScores { get; set; } = null!;

        public DbSet<ContestCategory> ContestCategories { get; set; } = null!;

        public DbSet<ContestQuestion> ContestQuestions { get; set; } = null!;

        public DbSet<ContestQuestionAnswer> ContestQuestionAnswers { get; set; } = null!;

        public DbSet<Checker> Checkers { get; set; } = null!;

        public DbSet<Test> Tests { get; set; } = null!;

        public DbSet<Submission> Submissions { get; set; } = null!;

        public DbSet<SubmissionForProcessing> SubmissionsForProcessing { get; set; } = null!;

        public DbSet<SubmissionType> SubmissionTypes { get; set; } = null!;

        public DbSet<SubmissionTypeInProblem> SubmissionTypeProblems { get; set; } = null!;

        public DbSet<SourceCode> SourceCodes { get; set; } = null!;

        public DbSet<TestRun> TestRuns { get; set; } = null!;

        public DbSet<FeedbackReport> FeedbackReports { get; set; } = null!;

        public DbSet<ParticipantAnswer> ParticipantAnswers { get; set; } = null!;

        public DbSet<LecturerInContest> LecturersInContests { get; set; } = null!;

        public DbSet<LecturerInContestCategory> LecturersInContestCategories { get; set; } = null!;

        public DbSet<Ip> Ips { get; set; } = null!;

        public DbSet<AccessLog> AccessLogs { get; set; } = null!;

        public DbSet<Tag> Tags { get; set; } = null!;

        public DbSet<TagInProblem> TagProblems { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            // Builder is configured in Service Collection registration.
            if (builder.IsConfigured)
            {
                return;
            }

            // NOTE: This is used by AutoCrudAdmin to just get metadata
            // about the db context via reflection and the parameterless constructor,
            // where no real connection has to be made, but to only instantiate the context.
            // Using the same name always, to not fill the memory with unused databases.
            builder.UseInMemoryDatabase($"{nameof(OjsDbContext)}InMemoryDatabase");
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserProfile>(b =>
            {
                b.Property(x => x.UserName)
                    .IsRequired()
                    .HasMaxLength(ConstraintConstants.User.UsernameMaxLength)
                    .IsUnicode(false);

                b.OwnsOne(x => x.UserSettings);

                b.HasMany(x => x.UsersInRoles)
                    .WithOne(x => x.User)
                    .HasForeignKey(x => x.UserId)
                    .IsRequired();
            });

            builder.Entity<SubmissionForProcessing>()
                .HasIndex(s => s.SubmissionId)
                .IsUnique();

            builder.Entity<Role>()
                .HasMany(x => x.UsersInRoles)
                .WithOne(x => x.Role)
                .HasForeignKey(x => x.RoleId)
                .IsRequired();

            builder.Entity<Ip>()
                .HasIndex(x => x.Value)
                .IsUnique();

            builder.Entity<LecturerInContest>()
                .HasKey(x => new { x.LecturerId, x.ContestId });

            builder.Entity<LecturerInContestCategory>()
                .HasKey(x => new { x.LecturerId, x.ContestCategoryId });

            builder.Entity<UserInExamGroup>()
                .HasKey(x => new { x.UserId, x.ExamGroupId });

            builder.Entity<ProblemForParticipant>()
                .HasKey(x => new { x.ProblemId, x.ParticipantId });

            builder.Entity<SubmissionTypeInProblem>()
                .HasKey(x => new { x.SubmissionTypeId, x.ProblemId });

            builder.Entity<IpInContest>()
                .HasKey(x => new { x.ContestId, x.IpId });

            builder.Entity<ParticipantAnswer>()
                .HasKey(x => new { x.ParticipantId, x.ContestQuestionId });

            builder.Entity<TagInProblem>()
                .HasKey(x => new { x.TagId, x.ProblemId });

            builder.Entity<Contest>(c =>
            {
                c.Property(cn => cn.AllowParallelSubmissionsInTasks).HasDefaultValue(true);
            });

            FixMultipleCascadePaths(builder);

            this.TryRegisterMatchingGlobalQueryFiltersForRequiredDeletableEntities(builder);
        }

        private static void FixMultipleCascadePaths(ModelBuilder builder)
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

            builder.Entity<ContestQuestion>()
                .HasMany(x => x.ParticipantAnswers)
                .WithOne(x => x.ContestQuestion)
                .HasForeignKey(x => x.ContestQuestionId)
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

            builder.Entity<Participant>()
                .HasQueryFilter(x => !x.Contest.IsDeleted);

            builder.Entity<LecturerInContestCategory>()
                .HasQueryFilter(x => !x.ContestCategory.IsDeleted);

            builder.Entity<ParticipantAnswer>()
                .HasQueryFilter(x => !x.ContestQuestion.IsDeleted);

            builder.Entity<ParticipantScore>()
                .HasQueryFilter(x => !x.Problem.IsDeleted);

            builder.Entity<ProblemForParticipant>()
                .HasQueryFilter(x => !x.Problem.IsDeleted);

            builder.Entity<Test>()
                .HasQueryFilter(x => !x.Problem.IsDeleted);

            builder.Entity<Submission>()
                .HasQueryFilter(x => !x.Problem.IsDeleted);

            builder.Entity<SubmissionTypeInProblem>()
                .HasQueryFilter(x => !x.Problem.IsDeleted);

            builder.Entity<TagInProblem>()
                .HasQueryFilter(x => !x.Problem.IsDeleted);

            builder.Entity<TestRun>()
                .HasQueryFilter(x => !x.Submission.IsDeleted);
        }
    }
}