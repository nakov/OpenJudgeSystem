namespace OJS.Services.Common.Exceptions
{
    using System;

    public class BusinessServiceException : Exception
    {
        public BusinessServiceException(string message)
            : base(message)
        {
        }
    }
}