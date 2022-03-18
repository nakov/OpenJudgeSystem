namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin;
using AutoCrudAdmin.Controllers;
using OJS.Services.Infrastructure.Exceptions;
using SoftUni.Data.Infrastructure.Models;
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

    protected int GetEntityIdFromQuery(IDictionary<string, string> complexId)
    {
        var idString = this.GetPrimaryKeyValueFromQuery(complexId);

        if (!int.TryParse(idString, out var id))
        {
            throw new BusinessServiceException($"Value \"{idString}\" for primary key must be convertible to int.");
        }

        return id;
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