namespace OJS.Services.Administration.Models;

public static class AdministrationConstants
{
    public static class AdministrationActions
    {
        // General
        public const string Unrestricted = "Unrestricted";
        public const string Restricted = "Restricted";

        // CRUD
        public const string Create = "Create";
        public const string Read = "Read";
        public const string Update = "Update";
        public const string Delete = "Delete";

        // Custom
        public const string RestrictedByContestId = "RestrictedByContestId";
    }
}