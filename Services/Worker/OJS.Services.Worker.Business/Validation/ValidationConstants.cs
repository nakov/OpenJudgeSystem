namespace OJS.Services.Worker.Business.Validation;

public static class ValidationConstants
{
    public const string ExecutionTypeNotFound = "Execution type not found.";
    public const string ExecutionStrategyNotFound = "Execution strategy not found.";

    public const string CheckerTypeNotValidTemplate = "Checker type \"{0}\" is not valid.";
    public const string CodeTemplateNotFoundTemplate = "Code Template for execution strategy \"{0}\" not found.";
    public const string CannotCreateInputTemplate = "Cannot create input for execution type \"{0}\".";

    public const string TestsExecutionDetailsCannotBeEmpty = "Tests execution must have execution details.";
    public const string TaskMaxPointsMustBeMoreThanZero = "Task max points must be more than 0.";
}