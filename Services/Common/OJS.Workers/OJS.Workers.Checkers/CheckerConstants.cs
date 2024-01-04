namespace OJS.Workers.Checkers
{
    public static class CheckerConstants
    {
        public static class TypeNames
        {
            public const string ExactMatch = nameof(ExactChecker);
            public const string CaseInsensitive = nameof(CaseInsensitiveChecker);
            public const string Precision = nameof(PrecisionChecker);
            public const string Sort = nameof(SortChecker);
            public const string Trim = nameof(TrimChecker);
            public const string TrimEnd = nameof(TrimEndChecker);
            public const string CSharpCode = nameof(CSharpCodeChecker);
            public const string CSharpCoreCode = nameof(CSharpCoreCodeChecker);

            public const string CompilationErrorMessage =
                "Please make sure the checker Parameter is correct and can be compiled";

            public static string[] All => new[]
            {
                ExactMatch,
                CaseInsensitive,
                Precision,
                Sort,
                Trim,
                TrimEnd,
                CSharpCode,
                CSharpCoreCode,
            };
        }
    }
}