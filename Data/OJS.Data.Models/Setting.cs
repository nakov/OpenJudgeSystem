namespace OJS.Data.Models
{
    using System.ComponentModel.DataAnnotations;

    public class Setting
    {
        [Key]
        public string Name { get; set; } = string.Empty;

        public string Value { get; set; } = string.Empty;
    }
}