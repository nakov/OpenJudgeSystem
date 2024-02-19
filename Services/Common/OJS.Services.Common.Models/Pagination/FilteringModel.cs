namespace OJS.Services.Common.Models.Pagination;
using OJS.Services.Common.Data.Pagination.Enums;
using System.Reflection;

public class FilteringModel
{
    public FilteringModel(PropertyInfo property, OperatorType operatorType, string value)
    {
        this.Property = property;
        this.OperatorType = operatorType;
        this.Value = value;
    }

    public PropertyInfo Property { get; set; }

    public OperatorType OperatorType { get; set; }

    public string Value { get; set; }
}