namespace OJS.Data.Models
{
    using OJS.Data.Infrastructure.Models;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using static OJS.Data.Validation.ConstraintConstants;

    public class Ip : AuditInfoEntity<int>
    {
        [Required]
        [MaxLength(IpAddressMaxLength)]
        public string Value { get; set; } = string.Empty;

        public string? Description { get; set; }

        public virtual ICollection<IpInContest> IpsInContests { get; set; } = new HashSet<IpInContest>();

        public override string ToString() => this.Value;
    }
}