namespace OJS.Workers.ExecutionStrategies.NodeJs
{
    public static class NodeJsConstants
    {
        // arguments
        public const string TestsReporterArgument = "-R"; // https://node-tap.org/docs/reporting/

        // flags
        public const string DelayFlag = "--delay";
        public const string LatestEcmaScriptFeaturesEnabledFlag = "--harmony";

        // other
        public const string JsonReportName = "json";
    }
}
