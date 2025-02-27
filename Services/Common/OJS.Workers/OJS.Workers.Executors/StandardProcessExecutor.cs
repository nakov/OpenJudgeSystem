﻿namespace OJS.Workers.Executors
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Text;

    using Microsoft.Extensions.Logging;
    using OJS.Workers.Common;
    using OJS.Workers.Common.Helpers;
    using System.Globalization;

#pragma warning disable CA1848
    // TODO: Implement memory constraints
    public class StandardProcessExecutor(
        int baseTimeUsed,
        int baseMemoryUsed,
        ITasksService tasksService,
        ILogger<StandardProcessExecutor> logger,
        ILogger strategyLogger,
        bool runAsRestrictedUser = false,
        IDictionary<string, string>? environmentVariables = null)
        : ProcessExecutor(baseTimeUsed, baseMemoryUsed, tasksService, environmentVariables)
    {
        private const int TimeBeforeClosingOutputStreams = 100;

        protected override async Task<ProcessExecutionResult> InternalExecute(
            string fileName,
            int timeLimit,
            string? inputData,
            IEnumerable<string>? executionArguments,
            string? workingDirectory,
            bool useSystemEncoding,
            double timeoutMultiplier)
        {
            var result = new ProcessExecutionResult { Type = ProcessExecutionResultType.Success };

            var processStartInfo = new ProcessStartInfo(fileName)
            {
                Arguments = executionArguments == null ? string.Empty : string.Join(" ", executionArguments),
                WindowStyle = ProcessWindowStyle.Hidden,
                CreateNoWindow = true,
                ErrorDialog = false,
                UseShellExecute = false,
                RedirectStandardError = true,
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                WorkingDirectory = workingDirectory,
                StandardOutputEncoding = useSystemEncoding ? Encoding.Default : new UTF8Encoding(false),
            };

            if (runAsRestrictedUser)
            {
                processStartInfo.UserName = Constants.RestrictedUserName;
            }

            // If we don't clear the environment variables,
            // the process will inherit the environment variables of the current process, which is a security risk
            // If any env variables are needed, they should be set explicitly
            processStartInfo.EnvironmentVariables.Clear();

            // Add custom environment variables
            foreach (var environmentVariable in this.EnvironmentVariables)
            {
                processStartInfo.EnvironmentVariables.Add(environmentVariable.Key, environmentVariable.Value);
            }

            strategyLogger.LogInformation("Starting process: {FileName} as user: {UserName} in directory: {WorkingDirectory}", fileName, processStartInfo.UserName, workingDirectory);
            strategyLogger.LogInformation("With time limit: {TimeLimit} ms", timeLimit);
            strategyLogger.LogInformation("With arguments: {Arguments}", processStartInfo.Arguments);

            var envVariablesString = new StringBuilder();
            foreach (var key in processStartInfo.EnvironmentVariables.Keys)
            {
                envVariablesString.AppendLine(CultureInfo.InvariantCulture, $"{key}={processStartInfo.EnvironmentVariables[key.ToString() ?? string.Empty]}");
            }

            if (envVariablesString.Length > 0)
            {
                strategyLogger.LogInformation("With environment variables: {EnvironmentVariables}", envVariablesString.ToString());
            }


            using var process = Process.Start(processStartInfo)
                ?? throw new Exception($"Could not start process: {fileName}!");

            var processStartTime = process.StartTime;

            if (!OsPlatformHelpers.IsUnix())
            {
                process.PriorityClass = ProcessPriorityClass.High;
            }

            var resourceConsumptionSamplingThread = this.StartResourceConsumptionSamplingThread(process, result);

            // Start reading standard output and error before writing to standard input to avoid deadlocks
            // and ensure fast reading of the output in case of a fast execution
            var processOutputTask = process.StandardOutput.ReadToEndAsync();
            var errorOutputTask = process.StandardError.ReadToEndAsync();

            if (inputData is not null)
            {
                strategyLogger.LogInformation("Writing the following input data to process: {NewLine}{InputData}", Environment.NewLine, inputData);

                await this.WriteInputToProcess(process, inputData);
            }

            // Wait the process to complete. Kill it after (timeLimit * 1.5) milliseconds if not completed.
            // We are waiting the process for more than defined time and after this we compare the process time with the real time limit.
            var exited = process.WaitForExit((int)(timeLimit * timeoutMultiplier));
            if (!exited)
            {
                // Double check if the process has exited before killing it
                if (!process.HasExited)
                {
                    process.Kill();
                    result.ProcessWasKilled = true;

                    strategyLogger.LogWarning("Process was killed because it exceeded the time limit.");

                    // Approach: https://msdn.microsoft.com/en-us/library/system.diagnostics.process.kill(v=vs.110).aspx#Anchor_2
                    process.WaitForExit(Constants.DefaultProcessExitTimeOutMilliseconds);
                }

                result.Type = ProcessExecutionResultType.TimeLimit;
            }

            strategyLogger.LogInformation("Process exited with code: {ExitCode}", process.ExitCode);

            try
            {
                this.TasksService.Stop(resourceConsumptionSamplingThread);
            }
            catch (AggregateException ex)
            {
                if (ex.InnerException is not TaskCanceledException)
                {
                    logger.LogAggregatedException(ex);
                }
            }

            // Read the standard output and error and set the result
            result.ErrorOutput = await this.GetReceivedOutput(errorOutputTask, "error output");
            result.ReceivedOutput = await this.GetReceivedOutput(processOutputTask, "standard output");

            Debug.Assert(process.HasExited, "Standard process didn't exit!");

            // Report exit code and total process working time
            result.ExitCode = process.ExitCode;
            result.TimeWorked = process.ExitTime - processStartTime;

            strategyLogger.LogInformation("Total process working time: {TimeWorked} ms", result.TimeWorked.TotalMilliseconds);

            if (!string.IsNullOrEmpty(result.ErrorOutput))
            {
                strategyLogger.LogError("Error output: {NewLine}{ErrorOutput}", Environment.NewLine, result.ErrorOutput);
            }

            if (!string.IsNullOrEmpty(result.ReceivedOutput))
            {
                strategyLogger.LogInformation("Received output: {NewLine}{ReceivedOutput}", Environment.NewLine, result.ReceivedOutput);
            }

            strategyLogger.LogInformation("================ Finished process execution ================");

            return result;
        }

        private async Task WriteInputToProcess(Process process, string inputData)
        {
            try
            {
                await process.StandardInput.WriteLineAsync(inputData);
                await process.StandardInput.FlushAsync();
            }
            catch (Exception ex)
            {
                logger.LogErrorWritingToStandardInput(inputData, ex);
            }
            finally
            {
                // Close the standard input stream to signal the process that we have finished writing to it
                try
                {
                    // Check if the process has exited before closing the standard input, preventing broken pipe exceptions
                    if (!process.HasExited)
                    {
                        process.StandardInput.Close();
                    }
                }
                catch (Exception ex)
                {
                    logger.LogErrorClosingStandardInput(ex);
                }
            }
        }

        private async Task<string> GetReceivedOutput(Task<string> outputTask, string outputName)
        {
            try
            {
                // Read the output with a timeout, ensuring that will not wait indefinitely
                var timeoutTask = Task.Delay(TimeBeforeClosingOutputStreams);
                var completedTask = await Task.WhenAny(outputTask, timeoutTask);
                if (completedTask == outputTask)
                {
                    // Only awaits if the task completed before the timeout
                    return await outputTask;
                }

                return $"{outputName} was too large and was not read.";
            }
            catch (Exception ex)
            {
                logger.LogErrorReadingProcessErrorOutput(ex);
                return $"Error while reading the {outputName} of the underlying process: {ex.Message}";
            }
        }
    }
#pragma warning restore CA1848
}
