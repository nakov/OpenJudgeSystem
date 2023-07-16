namespace OJS.Services.Worker.Business.ExecutionContext.Implementations;

using OJS.Workers.Common.Models;
using static OJS.Services.Worker.Business.ExecutionContext.ExecutionContextConstants.TemplatePlaceholders;

public class CodeTemplatesProviderService : ICodeTemplatesProviderService
{
    public string GetDefaultCodeTemplate(ExecutionStrategyType executionStrategyType)
    {
        switch (executionStrategyType)
        {
            case ExecutionStrategyType.CompileExecuteAndCheck:
            case ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck:
                return GetDefaultCSharpCodeTemplate();

            case ExecutionStrategyType.JavaPreprocessCompileExecuteAndCheck:
                return GetDefaultJavaCodeTemplate();

            case ExecutionStrategyType.NodeJsPreprocessExecuteAndCheck:
                return GetDefaultJavaScriptCodeTemplate();

            case ExecutionStrategyType.PythonExecuteAndCheck:
                return GetDefaultPythonCodeTemplate();

            default:
                return null!;
        }
    }

    private static string GetDefaultCSharpCodeTemplate() => $@"
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Text;
        using System.Numerics;

        public class Program
        {{
	        public static void Main(string[] args)
	        {{
                {CodePlaceholder}
	        }}
        }}";

    private static string GetDefaultJavaCodeTemplate() => $@"
        import java.util.*;
        import java.math.BigInteger;
        import java.math.BigDecimal;

        public class Program {{
            public static void main(String[] args) {{
	            {CodePlaceholder}
            }}
        }}";

    private static string GetDefaultJavaScriptCodeTemplate() => $@"
        function liveExample() {{
            {CodePlaceholder}
        }}";

    private static string GetDefaultPythonCodeTemplate() => $@"
import math

{CodePlaceholder}";
}