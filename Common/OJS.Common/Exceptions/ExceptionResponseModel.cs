namespace OJS.Common.Exceptions;

public class ExceptionResponseModel
{
    public ExceptionResponseModel()
    {
    }

    public ExceptionResponseModel(string name, string message)
    {
        this.Name = name;
        this.Message = message;
    }

    public string? Name { get; set; } = null;

    public string? Message { get; set; } = null;
}