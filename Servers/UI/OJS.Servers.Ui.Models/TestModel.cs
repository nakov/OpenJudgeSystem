namespace OJS.Servers.Ui.Models
{
    using OJS.Services.Infrastructure.Mapping;
    using OJS.Services.Models;

    public class TestModel : IMapFrom<TestServiceModel>
    {
        public string Kur { get; set; }
    }
}