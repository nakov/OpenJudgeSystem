namespace OJS.Services.Administration.Data
{
    using OJS.Data.Models;
    using OJS.Services.Common.Data;
    using System.Threading.Tasks;

    public interface IIpsDataService : IDataService<Ip>
    {
        Task<Ip?> GetByValue(string value);
    }
}