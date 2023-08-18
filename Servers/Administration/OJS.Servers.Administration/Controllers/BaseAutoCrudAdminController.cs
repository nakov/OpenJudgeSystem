namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin;
using AutoCrudAdmin.Controllers;
using AutoCrudAdmin.ViewModels;
using AutoCrudAdmin.Models;
using FluentExtensions.Extensions;
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
    protected override IEnumerable<FormControlViewModel> GenerateFormControls(
        TEntity entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters,
        Type autocompleteType = null)
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
}