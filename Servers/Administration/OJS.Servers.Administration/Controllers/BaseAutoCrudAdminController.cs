namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin;
using AutoCrudAdmin.Controllers;
using AutoCrudAdmin.Models;
using OJS.Services.Infrastructure.Exceptions;
using SoftUni.Data.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

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

    protected override async Task DeleteEntityAndSaveAsync(TEntity entity, AdminActionContext actionContext)
    {
        if (entity is IDeletableEntity deletableEntity)
        {
            deletableEntity.IsDeleted = true;
            deletableEntity.DeletedOn = DateTime.UtcNow;

            await this.EditEntityAndSaveAsync(entity, actionContext);
        }
    }

    private static string GetPrimaryKeyValueFromQuery(IDictionary<string, string> complexId)
    {
        const string key = Constants.Entity.SinglePrimaryKeyName;
        if (!complexId.TryGetValue(key, out var idString))
        {
            throw new BusinessServiceException($"{key} query param must be provided for the entity");
        }

        return idString;
    }
}