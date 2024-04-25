namespace OJS.Services.Administration.Data;

using OJS.Data.Models.Checkers;
using OJS.Services.Common.Data;
using System.Linq;
using System.Threading.Tasks;

public interface ICheckersDataService : IDataService<Checker>
{
    Task<Checker?> GetByName(string name);
}