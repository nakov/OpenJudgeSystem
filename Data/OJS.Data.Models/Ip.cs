namespace OJS.Data.Models
{
    using OJS.Data.Infrastructure.Models;
    using OJS.Data.Models.Contests;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using static OJS.Data.Validation.ConstraintConstants;

    public class Ip : Entity<int>
    {
        [Required]
        [MaxLength(IpAddressMaxLength)]
        public string Value { get; set; }

        public string Description { get; set; }

        public ICollection<IpInContest> IpsInContests { get; set; } = new HashSet<IpInContest>();
    }
}