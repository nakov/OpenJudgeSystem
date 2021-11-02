namespace OJS.Data.Models.Contests
{
    public class IpInContest
    {
        public int ContestId { get; set; }

        public Contest Contest { get; set; }

        public int IpId { get; set; }

        public Ip Ip { get; set; }

        public bool IsOriginallyAllowed { get; set; }
    }
}