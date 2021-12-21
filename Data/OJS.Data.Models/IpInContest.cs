namespace OJS.Data.Models
{
    using OJS.Data.Models.Contests;

    public class IpInContest
    {
        public int ContestId { get; set; }

        public virtual Contest Contest { get; set; } = new();

        public int IpId { get; set; }

        public virtual Ip Ip { get; set; } = new();

        public bool IsOriginallyAllowed { get; set; }
    }
}