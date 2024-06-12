namespace OJS.Data.Validation
{
    public static class ConstraintConstants
    {
        public const int FileExtensionMaxLength = 4;
        public const int IpAddressMaxLength = 45;

        public static class User
        {
            public const int UsernameMinLength = 5;
            public const int UsernameMaxLength = 50;
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

        public static class Contest
        {
            public const int NameMaxLength = 100;
            public const int NameMinLength = 4;

            public const int PasswordMaxLength = 20;

            public const int CategoryNameMaxLength = 100;
            public const int CategoryNameMinLength = 6;

            public const int QuestionMaxLength = 100;
            public const int QuestionMinLength = 1;

            public const int QuestionAnswerMaxLength = 100;
            public const int QuestionAnswerMinLength = 1;
        }

        public static class ExamGroup
        {
            public const int NameMinLength = 2;
            public const int NameMaxLength = 600;
        }

        public static class SubmissionTypes
        {
            public const int NameMaxLength = 100;
            public const int NameMinLength = 1;
        }

        public static class Problem
        {
            public const int NameMaxLength = 50;

            public const int ResourceNameMaxLength = 50;
            public const int ResourceNameMinLength = 3;
        }

        public static class Checker
        {
            public const int NameMaxLength = 100;
            public const int NameMinLength = 1;
        }

        public static class Submission
        {
            public const int WorkerNameMaxLength = 100;
        }
    }
}