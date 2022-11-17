namespace OJS.Services.Common.Models
{
    public class ServiceResult
    {
        public ServiceResult(string? error) => this.Error = error;

        public static ServiceResult Success => new (null);

        public string? Error { get; }

        public bool IsError => !string.IsNullOrWhiteSpace(this.Error);
    }
}