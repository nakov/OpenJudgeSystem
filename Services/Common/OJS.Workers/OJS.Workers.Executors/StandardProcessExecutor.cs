#nullable disable
namespace OJS.Workers.Executors
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Text;

    using log4net;

    using OJS.Workers.Common;
    using OJS.Workers.Common.Helpers;

    // TODO: Implement memory constraints
    public class StandardProcessExecutor : ProcessExecutor
    {
        private const int TimeBeforeClosingOutputStreams = 100;

#pragma warning disable SA1309
        private static ILog _logger;
#pragma warning restore SA1309

        public StandardProcessExecutor(int baseTimeUsed, int baseMemoryUsed, ITasksService tasksService)
            : base(baseTimeUsed, baseMemoryUsed, tasksService)
            => _logger = LogManager.GetLogger(typeof(StandardProcessExecutor));

        protected override async Task<ProcessExecutionResult> InternalExecute(
            string fileName,
            string inputData,
            int timeLimit,
            IEnumerable<string> executionArguments,
            string workingDirectory,
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

            using var process = Process.Start(processStartInfo);
            if (process == null)
            {
                throw new Exception($"Could not start process: {fileName}!");
            }

            var processStartTime = process.StartTime;

            if (!OsPlatformHelpers.IsUnix())
            {
                process.PriorityClass = ProcessPriorityClass.High;
            }

            var timeAndMemorySamplingThreadInfo = this.StartProcessorResourceConsumptionSamplingThread(process, result);

            // Start reading standard output and error before writing to standard input to avoid deadlocks
            // and ensure fast reading of the output in case of a fast execution
            var processOutputTask = process.StandardOutput.ReadToEndAsync();
            var errorOutputTask = process.StandardError.ReadToEndAsync();

            await WriteInputToProcess(process, inputData);

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

                    // Approach: https://msdn.microsoft.com/en-us/library/system.diagnostics.process.kill(v=vs.110).aspx#Anchor_2
                    process.WaitForExit(Constants.DefaultProcessExitTimeOutMilliseconds);
                }

                result.Type = ProcessExecutionResultType.TimeLimit;
            }

            try
            {
                this.TasksService.Stop(timeAndMemorySamplingThreadInfo);
            }
            catch (AggregateException ex)
            {
                _logger.Warn("AggregateException caught.", ex.InnerException);
            }

            // Read the standard output and error and set the result
            result.ErrorOutput = await GetReceivedOutput(errorOutputTask);
            result.ReceivedOutput = await GetReceivedOutput(processOutputTask);

            Debug.Assert(process.HasExited, "Standard process didn't exit!");

            // Report exit code and total process working time
            result.ExitCode = process.ExitCode;
            result.TimeWorked = process.ExitTime - processStartTime;

            return result;
        }

        private static async Task WriteInputToProcess(Process process, string inputData)
        {
            try
            {
                await process.StandardInput.WriteLineAsync(inputData);
                await process.StandardInput.FlushAsync();
            }
            catch (Exception ex)
            {
                _logger.Error($"Exception in writing to standard input with input data: {inputData}", ex);
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
                catch (Exception e)
                {
                    _logger.Warn("Exception caught while closing the standard input.", e);
                }
            }
        }

        private static async Task<string> GetReceivedOutput(Task<string> outputTask)
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

                return "Error output was too large and was not read.";
            }
            catch (Exception ex)
            {
                _logger.Warn("Exception caught while reading the process error output.", ex);
                return $"Error while reading the process error output: {ex.Message}";
            }
        }
    }
}
