namespace OJS.Workers.Common.Models
{
    using OJS.Workers.Common.Extensions;
    using System;

    public class ExceptionModel
    {
        // Used to deserialize from json
        public ExceptionModel()
        {
        }

        public ExceptionModel(Exception exception, bool includeStackTrace = false)
        {
            this.Message = exception.GetAllMessages();

            if (includeStackTrace)
            {
                this.StackTrace = exception.GetBaseException().StackTrace;
            }
        }

        public string? Message { get; set; }

        public string? StackTrace { get; set; }
    }
}