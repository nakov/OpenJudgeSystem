namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin;
using AutoCrudAdmin.Controllers;
using OJS.Services.Infrastructure.Exceptions;
using SoftUni.Data.Infrastructure.Models;
using System;
using System.Collections.Generic;

public class BaseAutoCrudAdminController<TEntity> : AutoCrudAdminController<TEntity>
    where TEntity : class
{
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

    protected TKey GetEntityIdFromQuery<TKey>(IDictionary<string, string> complexId)
    {
        var idString = this.GetPrimaryKeyValueFromQuery(complexId);
        object id;
        var keyType = typeof(TKey);

        if (keyType == typeof(string))
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

        return (TKey)Convert.ChangeType(id, typeof(TKey));
    }

    private string GetPrimaryKeyValueFromQuery(IDictionary<string, string> complexId)
    {
        const string key = Constants.Entity.SinglePrimaryKeyName;
        if (!complexId.TryGetValue(key, out var idString))
        {
            throw new BusinessServiceException($"{key} query param must be provided for the entity");
        }

        return idString;
    }
}