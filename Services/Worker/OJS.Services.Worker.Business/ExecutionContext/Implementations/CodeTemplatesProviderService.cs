namespace OJS.Services.Worker.Business.ExecutionContext.Implementations;

using OJS.Workers.Common.Models;

public class CodeTemplatesProviderService : ICodeTemplatesProviderService
{
    public string GetDefaultCodeTemplate(ExecutionStrategyType executionStrategyType)
    {
        switch (executionStrategyType)
        {
            case ExecutionStrategyType.CompileExecuteAndCheck:
            case ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck:
                return this.GetDefaultCSharpCodeTemplate();

            case ExecutionStrategyType.JavaPreprocessCompileExecuteAndCheck:
                return this.GetDefaultJavaCodeTemplate();

            case ExecutionStrategyType.NodeJsPreprocessExecuteAndCheck:
                return this.GetDefaultJavaScriptCodeTemplate();

            case ExecutionStrategyType.PythonExecuteAndCheck:
                return this.GetDefaultPythonCodeTemplate();

            default:
                return null;
        }
    }

    private string GetDefaultCSharpCodeTemplate() => $@"
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

    private string GetDefaultJavaCodeTemplate() => $@"
        import java.util.*;
        import java.math.BigInteger;
        import java.math.BigDecimal;

        public class Program {{
            public static void main(String[] args) {{
	            {CodePlaceholder}
            }}
        }}";

    private string GetDefaultJavaScriptCodeTemplate() => $@"
        function liveExample() {{
            {CodePlaceholder}
        }}";

    private string GetDefaultPythonCodeTemplate() => $@"
import math

{CodePlaceholder}";
}

