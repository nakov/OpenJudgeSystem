namespace OJS.Services.Ui.Models.Contests
{
    using OJS.Common.Extensions.Strings;

    public class ContestCategoryListViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string NameUrl => this.Name.ToUrl();

        public bool HasChildren { get; set; }
    }
}