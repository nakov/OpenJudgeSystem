namespace OJS.Data.Models.Mentor;

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using OJS.Data.Models.Users;

public class UserMentor
{
    [Key]
    [ForeignKey(nameof(User))]
    public string UserId { get; set; } = default!;

    public virtual UserProfile User { get; set; } = null!;

    public DateTimeOffset QuotaResetTime { get; set; }

    public int RequestsMade { get; set; }

    public int QuotaLimit { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }
}