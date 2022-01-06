namespace OJS.Data.Models
{
    using OJS.Data.Models.Contests;

    public class IpInContest
    {
        public int ContestId { get; set; }

        public virtual Contest Contest { get; set; } = null!;

        public int IpId { get; set; }

        public virtual Ip Ip { get; set; } = null!;

        public bool IsOriginallyAllowed { get; set; }
    }
}