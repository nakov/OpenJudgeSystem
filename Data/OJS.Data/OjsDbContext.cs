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
    using OJS.Data.Infrastructure;

    public class OjsDbContext : BaseAuthDbContext<OjsDbContext, UserProfile, Role, UserInRole>,
        IDataProtectionKeyContext
    {
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

        public DbSet<Participant> Participants { get; set; } = null!;

        public DbSet<ParticipantScore> ParticipantScores { get; set; } = null!;

        public DbSet<ContestCategory> ContestCategories { get; set; } = null!;

        public DbSet<Checker> Checkers { get; set; } = null!;

        public DbSet<Test> Tests { get; set; } = null!;

        public DbSet<Submission> Submissions { get; set; } = null!;

        public DbSet<SubmissionForProcessing> SubmissionsForProcessing { get; set; } = null!;

        public DbSet<SubmissionType> SubmissionTypes { get; set; } = null!;

        public DbSet<SubmissionTypeInProblem> SubmissionTypeProblems { get; set; } = null!;

        public DbSet<TestRun> TestRuns { get; set; } = null!;

        public DbSet<FeedbackReport> FeedbackReports { get; set; } = null!;

        public DbSet<LecturerInContest> LecturersInContests { get; set; } = null!;

        public DbSet<LecturerInContestCategory> LecturersInContestCategories { get; set; } = null!;

        public DbSet<Ip> Ips { get; set; } = null!;

        public DbSet<AccessLog> AccessLogs { get; set; } = null!;

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

            builder.Entity<Contest>(c =>
            {
                c.Property(cn => cn.AllowParallelSubmissionsInTasks).HasDefaultValue(true);
            });

            // Participant with submissions will not be able to be deleted. Use IsInvalidated instead.
            builder.Entity<Participant>()
                .HasMany(x => x.Submissions)
                .WithOne(x => x.Participant)
                .HasForeignKey(x => x.ParticipantId)
                .OnDelete(DeleteBehavior.Restrict);

            FixMultipleCascadePaths(builder);

            AddGlobalQueryFilters(builder);
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
        }

        // TODO: Add automatic test to validate all IDeletableEntity entities have global query filter for IsDeleted
        private static void AddGlobalQueryFilters(ModelBuilder builder)
        {
            builder.Entity<Checker>()
                .HasQueryFilter(x => !x.IsDeleted);

            builder.Entity<Contest>()
                .HasQueryFilter(x => !x.IsDeleted);

            builder.Entity<ContestCategory>()
                .HasQueryFilter(x => !x.IsDeleted);

            builder.Entity<ExamGroup>()
                .HasQueryFilter(x => (x.Contest == null || !x.Contest.IsDeleted));

            builder.Entity<Participant>()
                .HasQueryFilter(x => !x.Contest.IsDeleted);

            builder.Entity<ParticipantScore>()
                .HasQueryFilter(x => !x.Problem.IsDeleted);

            builder.Entity<Problem>()
                .HasQueryFilter(x => !x.IsDeleted);

            builder.Entity<ProblemGroup>()
                .HasQueryFilter(x => !x.IsDeleted);

            builder.Entity<ProblemResource>()
                .HasQueryFilter(x => !x.IsDeleted);

            builder.Entity<Submission>()
                .HasQueryFilter(x => !x.IsDeleted);

            builder.Entity<Test>()
                .HasQueryFilter(x => !x.Problem.IsDeleted);

            builder.Entity<TestRun>()
                .HasQueryFilter(x => !x.Submission.IsDeleted);

            builder.Entity<UserProfile>()
                .HasQueryFilter(x => !x.IsDeleted);

            builder.Entity<AccessLog>()
                .HasQueryFilter(x => !x.User.IsDeleted);

            builder.Entity<UserInExamGroup>()
                .HasQueryFilter(x => !x.User.IsDeleted);

            builder.Entity<UserInRole>()
                .HasQueryFilter(x => !x.User.IsDeleted);

            builder.Entity<FeedbackReport>()
                .HasQueryFilter(x => !x.IsDeleted);

            builder.Entity<IpInContest>()
                .HasQueryFilter(x => !x.Contest.IsDeleted);

            builder.Entity<LecturerInContest>()
                .HasQueryFilter(x => !x.Contest.IsDeleted);

            builder.Entity<LecturerInContestCategory>()
                .HasQueryFilter(x => !x.ContestCategory.IsDeleted);

            builder.Entity<ProblemForParticipant>()
                .HasQueryFilter(x => !x.Problem.IsDeleted);

            builder.Entity<SubmissionTypeInProblem>()
                .HasQueryFilter(x => !x.Problem.IsDeleted);
        }
    }
}