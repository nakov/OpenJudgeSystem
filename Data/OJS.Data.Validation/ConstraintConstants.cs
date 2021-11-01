namespace OJS.Data.Validation
{
    public static class ConstraintConstants
    {
        public static class User
        {
            public const int UsernameMinLength = 5;
            public const int UsernameMaxLength = 32;
            public const string UsernameRegEx = @"^[a-zA-Z]([/._]?[a-zA-Z0-9]+)+$";

            public const int PasswordMinLength = 6;
            public const int PasswordMaxLength = 1000;

            public const int EmailMinLength = 6;
            public const int EmailMaxLength = 80;
            public const string EmailRegEx = "^[A-Za-z0-9]+[\\._A-Za-z0-9-]+@([A-Za-z0-9]+[-\\.]?[A-Za-z0-9]+)+(\\.[A-Za-z0-9]+[-\\.]?[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

            public const int NameMinLength = 2;
            public const int NameMaxLength = 30;

            public const int CityMinLength = 2;
            public const int CityMaxLength = 200;

            public const int CompanyMinLength = 2;
            public const int CompanyMaxLength = 200;
            public const int JobTitleMinLength = 2;
            public const int JobTitleMaxLength = 100;
            public const int FacultyNumberMaxLength = 30;
        }
    }
}