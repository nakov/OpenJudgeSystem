namespace OJS.Common.Exceptions;

using System.Collections.Generic;
using System.Linq;

public class ExceptionResponse
{
    public List<ExceptionResponseModel> Errors { get; set; } = new();

    public bool IsValid => !this.Errors.Any();
}