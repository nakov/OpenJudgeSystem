namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.ViewModels;
using System.Collections.Generic;
using System.Linq;
using OJS.Data.Models.Submissions;

public class SubmissionsForProcessing : BaseAutoCrudAdminController<SubmissionForProcessing>
{
    protected override IEnumerable<GridAction> DefaultActions
        => Enumerable.Empty<GridAction>();
}