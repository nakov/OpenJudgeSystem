namespace OJS.Services.Worker.Business.Validation;

using System.Text;

public static class ValidationConstants
{
    public const string ExecutionTypeNotFound = "Execution type not found.";
    public const string ExecutionStrategyNotFound = "Execution strategy not found.";

    public static CompositeFormat CheckerTypeNotValidTemplate => CompositeFormat.Parse("Checker type \"{0}\" is not valid.");
    public static CompositeFormat CodeTemplateNotFoundTemplate => CompositeFormat.Parse("Code Template for execution strategy \"{0}\" not found.");
    public static CompositeFormat CannotCreateInputTemplate => CompositeFormat.Parse("Cannot create input for execution type \"{0}\".");

    public const string TestsExecutionDetailsCannotBeEmpty = "Tests execution must have execution details.";
    public const string TaskMaxPointsMustBeMoreThanZero = "Task max points must be more than 0.";
}