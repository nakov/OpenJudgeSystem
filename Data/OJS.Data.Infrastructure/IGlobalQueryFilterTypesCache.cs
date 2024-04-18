namespace OJS.Data.Infrastructure;

using System.Collections.Generic;
using OJS.Data.Infrastructure.Enumerations;

public interface IGlobalQueryFilterTypesCache
{
    IEnumerable<GlobalQueryFilterType> GetAll();

    bool Contains(GlobalQueryFilterType globalQueryFilterType);
}
