namespace OJS.Data.Models
{
    using OJS.Common.Enumerations;
    using OJS.Data.Infrastructure.Models;

    public class Setting : Entity<int>
    {
        public string Name { get; set; } = string.Empty;

        public string Value { get; set; } = string.Empty;

        public SettingType Type { get; set; }
    }
}