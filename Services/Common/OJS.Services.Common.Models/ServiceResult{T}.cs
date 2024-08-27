namespace OJS.Services.Common.Models
{
    public class ServiceResult<T> : ServiceResult
    {
        public ServiceResult(string? error)
            : base(error)
        {
        }

        public T? Data { get; private set; }

#pragma warning disable CA1000
        public static new ServiceResult<T> Success(T data)
#pragma warning restore CA1000
            => new(null)
            {
                Data = data,
            };
    }
}