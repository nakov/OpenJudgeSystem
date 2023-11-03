using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using OJS.Workers.Common.Models;

namespace OJS.Web.Common.Helpers
{
    public static class WorkerTypesHelper
    {
        public static IEnumerable<SelectListItem> GetWorkerTypesWithExcluded()
        {
            return Enum.GetValues(typeof(WorkerType)).Cast<WorkerType>()
                .Select(e => new SelectListItem
                {
                    Text = e.ToString(),
                    Value = ((int)e).ToString()
                }).ToList();
        }
        
        public static IEnumerable<SelectListItem> GetWorkerTypes(IEnumerable<WorkerType> workerTypesToExclude)
        {
            return Enum.GetValues(typeof(WorkerType)).Cast<WorkerType>()
                .Where(wt => !workerTypesToExclude.Contains(wt))
                .Select(e => new SelectListItem
                {
                    Text = e.ToString(),
                    Value = ((int)e).ToString()
                }).ToList();
        }
    }
}