namespace OJS.Services.Infrastructure.HttpClients
{
    using OJS.Services.Common.Models;
    using System.Threading.Tasks;

    public interface ISulsPlatformHttpClientService : IHttpClientService
    {
        Task<ExternalDataRetrievalResult<TData>> GetAsync<TData>(
            object requestData,
            string endpoint);
    }
}