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

            try
            {
                // Write to standard input using another thread
                await process.StandardInput.WriteLineAsync(inputData);
                await process.StandardInput.FlushAsync();
            }
            catch (Exception ex)
            {
                result.ErrorOutput = $"Exception in writing to standard input. {ex.Message}";
                _logger.Error($"Exception in writing to standard input with input data: {inputData}", ex);
            }
            finally
            {
                process.StandardInput.Close();
            }

            // Read standard output using another thread to prevent process locking (waiting us to empty the output buffer)
            var processOutputTask = process
                .StandardOutput
                .ReadToEndAsync()
                .ContinueWith(x => result.ReceivedOutput = x.Result);

            // Read standard error using another thread
            var errorOutputTask = process
                .StandardError
                .ReadToEndAsync()
                .ContinueWith(x => result.ErrorOutput = x.Result);

            // Read memory consumption every few milliseconds to determine the peak memory usage of the process
            var memorySamplingThreadInfo = this.StartMemorySamplingThread(process, result);

            // If not on Windows, read time consumption every few milliseconds to determine the time usage of the process
            TaskInfo timeSamplingThreadInfo = null;
            if (!OsPlatformHelpers.IsWindows())
            {
                timeSamplingThreadInfo = this.StartProcessorTimeSamplingThread(process, result);
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

                    // Approach: https://msdn.microsoft.com/en-us/library/system.diagnostics.process.kill(v=vs.110).aspx#Anchor_2
                    process.WaitForExit(Constants.DefaultProcessExitTimeOutMilliseconds);
                }

                result.Type = ProcessExecutionResultType.TimeLimit;
            }

            // Close the memory check thread
            try
            {
                this.TasksService.Stop(memorySamplingThreadInfo);
            }
            catch (AggregateException ex)
            {
                _logger.Warn("AggregateException caught.", ex.InnerException);
            }

            // Close the time sampling thread if open
            if (timeSamplingThreadInfo != null)
            {
                try
                {
                    this.TasksService.Stop(timeSamplingThreadInfo);
                }
                catch (AggregateException ex)
                {
                    _logger.Warn("AggregateException caught.", ex.InnerException);
                }
            }

            // Close the task that gets the process error output
            try
            {
                errorOutputTask.Wait(TimeBeforeClosingOutputStreams);
            }
            catch (AggregateException ex)
            {
                _logger.Warn("AggregateException caught.", ex.InnerException);
            }
            catch (Exception ex)
            {
                result.ErrorOutput = $"Error while reading the process streams. {ex.Message}";
            }

            // Close the task that gets the process output
            try
            {
                processOutputTask.Wait(TimeBeforeClosingOutputStreams);
            }
            catch (AggregateException ex)
            {
                _logger.Warn("AggregateException caught.", ex.InnerException);
            }
            catch (Exception ex)
            {
                result.ErrorOutput = $"Error while reading the process streams. {ex.Message}";
            }

            Debug.Assert(process.HasExited, "Standard process didn't exit!");

            // Report exit code and total process working time
            result.ExitCode = process.ExitCode;
            result.TimeWorked = process.ExitTime - processStartTime;

            if (OsPlatformHelpers.IsWindows())
            {
                result.PrivilegedProcessorTime = process.PrivilegedProcessorTime;
                result.UserProcessorTime = process.UserProcessorTime;
            }

            return result;
        }
    }
}
