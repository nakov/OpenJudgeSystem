#nullable disable
namespace OJS.Workers.Executors.Process
{
    using System;

    internal struct ProcessThreadTimes
    {
#pragma warning disable SA1307
        public long create;
        public long exit;
        public long kernel;
        public long user;
#pragma warning restore SA1307

        public DateTime StartTime => DateTime.FromFileTime(this.create);

        public DateTime ExitTime => DateTime.FromFileTime(this.exit);

        public TimeSpan PrivilegedProcessorTime => new TimeSpan(this.kernel);

        public TimeSpan UserProcessorTime => new TimeSpan(this.user);

        public TimeSpan TotalProcessorTime => new TimeSpan(this.user + this.kernel);
    }
}
