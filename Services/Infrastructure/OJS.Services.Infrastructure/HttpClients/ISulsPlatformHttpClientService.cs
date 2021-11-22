namespace OJS.Services.Infrastructure.HttpClients
{
    using OJS.Services.Common.Models;
    using System.Threading.Tasks;

    public interface ISulsPlatformHttpClientService
    {
        Task<ExternalDataRetrievalResult<TData>> GetAsync<TData>(
            object requestData,
            string endpoint);
    }
}