namespace OJS.Servers.Administration.Pages;

using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using OJS.Services.Administration.Models;
using System.Collections.Generic;
using System.Linq;

public class BasePageModel : PageModel
{
    protected IEnumerable<SelectListItem> GetSelectListItemsFrom(
        IEnumerable<SelectListItemApiServiceModel> items,
        string? selectedValue = null)
        => items.Select(x => new SelectListItem
        {
            Text = x.Text,
            Value = x.Value,
            Selected = selectedValue == x.Value,
        });
}