namespace OJS.Web.Infrastructure.Filters
{
    using System.Web.Mvc;
    using OJS.Services.Common.Exceptions;

    public class CustomExceptionHandlerFilter : FilterAttribute, IExceptionFilter
    {
        public void OnException(ExceptionContext exceptionContext)
        {
            if (exceptionContext.Exception is BusinessServiceException bse)
            {
                this.HandleBusinessServiceException(exceptionContext, bse);
            }
        }

        private void HandleBusinessServiceException(ExceptionContext exceptionContext, BusinessServiceException bse)
        {
            var response = exceptionContext.RequestContext.HttpContext.Response;

            response.StatusCode = 422;
            response.ClearContent();
            response.Write(bse.Message);
            exceptionContext.ExceptionHandled = true;
        }
    }
}