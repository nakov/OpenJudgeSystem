namespace OJS.Services.Administration.Models.Users;

using OJS.Data.Models.Users;

public class UserAdministrationModel : BaseAdministrationModel<string>
{
    public string? Email { get; set; }

    public string? UserName { get; set; }

    public UserSettingsAdministrationModel? UserSettings { get; set; }
}