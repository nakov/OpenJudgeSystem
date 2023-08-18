namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin;
using AutoCrudAdmin.Controllers;
using AutoCrudAdmin.ViewModels;
using AutoCrudAdmin.Models;
using FluentExtensions.Extensions;
using NonFactors.Mvc.Grid;
using OJS.Common.Utils;
using OJS.Services.Infrastructure.Exceptions;
using SoftUni.Data.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;

using static Common.GlobalConstants.EnvironmentVariables;

public class BaseAutoCrudAdminController<TEntity> : AutoCrudAdminController<TEntity>
    where TEntity : class
{
    private static readonly TimeZoneInfo LocalTimeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(EnvironmentUtils.GetRequiredByKey(LocalTimeZone));

    protected override IEnumerable<string> HiddenFormControlNames
        => new[]
        {
            nameof(IAuditInfoEntity.CreatedOn),
            nameof(IAuditInfoEntity.ModifiedOn),

            nameof(IDeletableEntity.IsDeleted),
            nameof(IDeletableEntity.DeletedOn),
        };

    protected override IEnumerable<string> HiddenFormControlNamesOnCreate
        => new[]
        {
            nameof(IEntity<object>.Id),
        };

    protected TEntityId GetEntityIdFromQuery<TEntityId>(IDictionary<string, string> complexId)
    {
        var idString = GetPrimaryKeyValueFromQuery(complexId);
        object id;
        var idType = typeof(TEntityId);

        if (idType == typeof(string))
        {
            id = idString;
        }
        else
        {
            if (!int.TryParse(idString, out var idInt))
            {
                throw new BusinessServiceException($"Value \"{idString}\" for primary key must be convertible to int.");
            }

            id = idInt;
        }

        return (TEntityId)Convert.ChangeType(id, typeof(TEntityId));
    }

    protected virtual Task ModifyFormControls(
        ICollection<FormControlViewModel> formControls,
        TEntity entity,
        EntityAction action,
        IDictionary<string, string> entityDict)
        => Task.CompletedTask;

    protected override async Task DeleteEntityAndSaveAsync(TEntity entity, AdminActionContext actionContext)
    {
        if (entity is IDeletableEntity deletableEntity)
        {
            deletableEntity.IsDeleted = true;
            deletableEntity.DeletedOn = DateTime.UtcNow;

            await this.EditEntityAndSaveAsync(entity, actionContext);
        }
        else
        {
            await base.DeleteEntityAndSaveAsync(entity, actionContext);
        }
    }

#nullable disable
    protected override IGridColumnsOf<TEntity> BuildGridColumns(IGridColumnsOf<TEntity> columns, int? stringMaxLength)
    {
        var gridColumns = base.BuildGridColumns(columns, stringMaxLength);

        // Convert DateTime values to local time before displaying, as the admins will be working with local time,
        // but in the database are always stored in UTC.
        // TODO: provide option to override a method that just generates the expression that gets the property value.
        // This is a workaround, but if option to override the method that gets the lambda is provided,
        // in the AutoCrudAdminOptions (GenerateColumnConfiguration), it will be much easier to just override the expression.
        gridColumns.ForEach(gc =>
        {
            var propertyInfo = typeof(TEntity).GetProperty(gc.Name);
            if (propertyInfo == null || !TypeIsDateTime(propertyInfo.PropertyType))
            {
                return;
            }

            gridColumns.Remove(gc);

            if (gc is IGridColumn<TEntity, DateTime> dateTimeGridColumn)
            {
                gridColumns
                    .Add(
                        this.GetDateTimeToLocalExpression<DateTime>(propertyInfo)
                        ?? dateTimeGridColumn.Expression)
                    .Titled(propertyInfo.Name)
                    .Filterable(true)
                    .Sortable(true);
            }
            else if (gc is IGridColumn<TEntity, DateTime?> nullableDateTimeGridColumn)
            {
                gridColumns
                    .Add(
                        this.GetDateTimeToLocalExpression<DateTime?>(propertyInfo)
                        ?? nullableDateTimeGridColumn.Expression)
                    .Titled(propertyInfo.Name)
                    .Filterable(true)
                    .Sortable(true);
            }
        });

        return gridColumns;
    }

    protected override IEnumerable<FormControlViewModel> GenerateFormControls(
        TEntity entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters,
        Type autocompleteType)
    {
        var formControls =
            base.GenerateFormControls(entity, action, entityDict, complexOptionFilters, autocompleteType)
                .ToList();

        // Convert DateTime values to local time before displaying, as the admins will be working with local time,
        // but in the database are always stored in UTC.
        formControls
            .Where(fc => TypeIsDateTime(fc.Type) && fc.Value != null)
            .ForEach(fc =>
            {
                var dateTime = (DateTime)fc.Value!;
                fc.Value = TimeZoneInfo.ConvertTimeFromUtc(dateTime, LocalTimeZoneInfo);
            });

        return formControls;
    }

    /// <summary>
    /// Executes logic before saving the entity. NOTE: always call base when overriding.
    /// <remarks>
    /// The base should be called first in every override,
    /// as it makes conversions to the dates - assumes provided time is always local (specified in settings)
    /// and converts it to UTC.
    /// </remarks>
    /// </summary>
    /// <param name="entity">The entity being saved.</param>
    /// <param name="actionContext">
    /// The action context, containing information about the action being executed and raw values passed.
    /// </param>
    protected override async Task BeforeEntitySaveAsync(TEntity entity, AdminActionContext actionContext)
    {
        await base.BeforeEntitySaveAsync(entity, actionContext);

        var entityProperties = entity
            .GetType()
            .GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .Where(p => actionContext.EntityDict.ContainsKey(p.Name));

        // Convert DateTime values to UTC before saving, as admins will be working with local time,
        // but in the database are always stored in UTC.
        var dateTimeProperties = entityProperties
            .Where(p => TypeIsDateTime(p.PropertyType))
            .ToList();

        dateTimeProperties.ForEach(p =>
        {
            var dateTime = p.GetValue(entity);
            if (dateTime == null)
            {
                return;
            }

            var dateTimeUtc = TimeZoneInfo.ConvertTimeToUtc((DateTime)dateTime, LocalTimeZoneInfo);
            p.SetValue(entity, dateTimeUtc);
        });
    }
#nullable restore

    private static string GetPrimaryKeyValueFromQuery(IDictionary<string, string> complexId)
    {
        const string key = Constants.Entity.SinglePrimaryKeyName;
        if (!complexId.TryGetValue(key, out var idString))
        {
            throw new BusinessServiceException($"{key} query param must be provided for the entity");
        }

        return idString;
    }

    private static bool TypeIsDateTime(Type type)
        => type == typeof(DateTime) || type == typeof(DateTime?);

    private Expression<Func<TEntity, TProperty>>? GetDateTimeToLocalExpression<TProperty>(PropertyInfo property)
    {
        if (!TypeIsDateTime(property.PropertyType))
        {
            return null;
        }

        var dateTimeProperty = typeof(TEntity).GetProperty(property.Name) !;
        var parameter = Expression.Parameter(typeof(TEntity), "model");
        var dateTimePropertyAccess = Expression.Property(parameter, dateTimeProperty);

        var convertMethod = typeof(TimeZoneInfo)
            .GetMethod(nameof(TimeZoneInfo.ConvertTimeFromUtc), new[] { typeof(DateTime), typeof(TimeZoneInfo) }) !;
        var localTimeZoneInfo = Expression.Constant(LocalTimeZoneInfo);

        if (typeof(TProperty) == typeof(DateTime?))
        {
            var nullCheckExpression = Expression.Equal(dateTimePropertyAccess, Expression.Constant(null));
            var convertCall = Expression.Condition(
                nullCheckExpression,
                Expression.Constant(null, typeof(DateTime?)),
                Expression.Convert(
                    Expression.Call(
                        convertMethod,
                        Expression.Convert(dateTimePropertyAccess, typeof(DateTime)),
                        localTimeZoneInfo),
                    typeof(DateTime?)));

            var getLocalDateTimeLambda = Expression.Lambda<Func<TEntity, TProperty>>(convertCall, parameter);
            return getLocalDateTimeLambda;
        }
        else
        {
            var convertCall = Expression.Call(convertMethod, dateTimePropertyAccess, localTimeZoneInfo);
            var getLocalDateTimeLambda = Expression.Lambda<Func<TEntity, TProperty>>(convertCall, parameter);
            return getLocalDateTimeLambda;
        }
    }
}