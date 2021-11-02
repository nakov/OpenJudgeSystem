namespace OJS.Servers.Ui.Models
{
    using OJS.Services.Infrastructure.Mapping;
    using OJS.Services.Common.Models;

    public class TestModel : IMapFrom<TestServiceModel>
    {
        public string Kur { get; set; }
    }
}