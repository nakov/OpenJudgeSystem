using OJS.Common.Extensions.Strings;

namespace OJS.Services.Ui.Models.Contests
{
    public class ContestCategoryListViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string NameUrl => this.Name.ToUrl();

        public bool HasChildren { get; set; }
    }
}