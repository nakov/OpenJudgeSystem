namespace OJS.Data.Configurations
{
    using System.Data.Entity.ModelConfiguration;
    using OJS.Data.Models;

    public class ProblemSubmissionTypeSkeletonConfiguration : EntityTypeConfiguration<ProblemSubmissionTypeSkeleton>
    {
        public ProblemSubmissionTypeSkeletonConfiguration()
        {
            this.HasKey(
                pst => 
                    new
                    { 
                        pst.ProblemId, pst.SubmissionTypeId
                    });

            this
                .HasRequired(pst => pst.Problem)
                .WithMany(p => p.ProblemSubmissionTypesSkeletons)
                .HasForeignKey(pst => pst.ProblemId);

            this
                .HasRequired(pst => pst.SubmissionType)
                .WithMany(st => st.ProblemSubmissionTypesSkeletons)
                .HasForeignKey(pst => pst.SubmissionTypeId);
        }
    }
}