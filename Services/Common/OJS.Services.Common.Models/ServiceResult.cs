namespace OJS.Services.Common.Models
{
    public class ServiceResult
    {
        public static ServiceResult Success => new ServiceResult(null);

        public ServiceResult(string error) => this.Error = error;

        public string Error { get; }

        public bool IsError => !string.IsNullOrWhiteSpace(this.Error);
    }
}