namespace OJS.Data.Models
{
    using OJS.Data.Models.Contests;

    public class IpInContest
    {
        public int ContestId { get; set; }

        public virtual Contest? Contest { get; set; }

        public int IpId { get; set; }

        public virtual Ip? Ip { get; set; }

        public bool IsOriginallyAllowed { get; set; }
    }
}