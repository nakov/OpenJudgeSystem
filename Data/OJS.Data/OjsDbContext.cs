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
        public OjsDbContext()
        {
        }

        public OjsDbContext(
            DbContextOptions<OjsDbContext> options,
            IGlobalQueryFilterTypesCache globalQueryFilterTypesCache)
            : base(options, globalQueryFilterTypesCache)
        {
        }

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

            base.OnModelCreating(builder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.ConfigureDbOptions(ApplicationName.Ui);
    }
}