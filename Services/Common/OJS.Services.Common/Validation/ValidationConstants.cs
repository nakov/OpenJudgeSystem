namespace OJS.Services.Common.Validation;

using System.Text;

public static class ValidationConstants
{
    public static CompositeFormat CannotBeTemplate => CompositeFormat.Parse("{0} cannot be {1}");
    public static CompositeFormat CannotBeNullTemplate => CompositeFormat.Parse("{0} cannot be null");
}