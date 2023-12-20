#nullable disable
[assembly: log4net.Config.XmlConfigurator(Watch = true)]

namespace OJS.Workers.Executors
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;

    using log4net;

    using OJS.Workers.Common;
    using OJS.Workers.Executors.Process;

    using static OJS.Workers.Common.Constants;

    public class RestrictedProcessExecutor : ProcessExecutor
    {
        private const int TimeBeforeClosingOutputStreams = 300;

#pragma warning disable SA1309
        private static ILog _logger;
#pragma warning restore SA1309

        public RestrictedProcessExecutor(int baseTimeUsed, int baseMemoryUsed, ITasksService tasksService)
            : base(baseTimeUsed, baseMemoryUsed, tasksService)
            => _logger = LogManager.GetLogger(typeof(RestrictedProcessExecutor));

        protected override ProcessExecutionResult InternalExecute(
            string fileName,
            string inputData,
            int timeLimit,
            int memoryLimit,
            IEnumerable<string> executionArguments,
            string workingDirectory,
            bool useSystemEncoding,
            double timeoutMultiplier)
        {
            var result = new ProcessExecutionResult { Type = ProcessExecutionResultType.Success };
            var bufferSize = Math.Max(ProcessDefaultBufferSizeInBytes, (inputData.Length * 2) + 4);

            using (var restrictedProcess = new RestrictedProcess(
                fileName,
                workingDirectory,
                executionArguments,
                bufferSize,
                useSystemEncoding))
            {
                // Write to standard input using another thread
                restrictedProcess.StandardInput.WriteLineAsync(inputData).ContinueWith(
                    _ =>
                    {
                        // ReSharper disable once AccessToDisposedClosure
                        if (!restrictedProcess.IsDisposed)
                        {
                            // ReSharper disable once AccessToDisposedClosure
                            restrictedProcess.StandardInput.FlushAsync().ContinueWith(
                                __ => restrictedProcess.StandardInput.Close());
                        }
                    });

                // Read standard output using another thread to prevent process locking (waiting us to empty the output buffer)
                var processOutputTask = restrictedProcess
                    .StandardOutput
                    .ReadToEndAsync()
                    .ContinueWith(x => result.ReceivedOutput = x.Result);

                // Read standard error using another thread
                var errorOutputTask = restrictedProcess
                    .StandardError
                    .ReadToEndAsync()
                    .ContinueWith(x => result.ErrorOutput = x.Result);

                // Read memory consumption every few milliseconds to determine the peak memory usage of the process
                var memorySamplingThreadInfo = this.StartMemorySamplingThread(restrictedProcess, result);

                // Start the process
                restrictedProcess.Start(timeLimit, memoryLimit);

                // Wait the process to complete. Kill it after (timeLimit * 1.5) milliseconds if not completed.
                // We are waiting the process for more than defined time and after this we compare the process time with the real time limit.
                var exited = restrictedProcess.WaitForExit((int)(timeLimit * timeoutMultiplier));
                if (!exited)
                {
                    restrictedProcess.Kill();

                    // Wait for the associated process to exit before continuing
                    restrictedProcess.WaitForExit(DefaultProcessExitTimeOutMilliseconds);

                    result.ProcessWasKilled = true;
                    result.Type = ProcessExecutionResultType.TimeLimit;
                }

                // Close the memory consumption check thread
                try
                {
                    this.TasksService.Stop(memorySamplingThreadInfo);
                }
                catch (AggregateException ex)
                {
                    _logger.Warn($"AggregateException caught in Memory Sampling Thread. Inner Exception: {ex.InnerException}");
                }

                // Close the task that gets the process error output
                try
                {
                    errorOutputTask.Wait(TimeBeforeClosingOutputStreams);
                }
                catch (AggregateException ex)
                {
                    _logger.Warn($"AggregateException caught in Error Output Thread. Inner Exception: {ex.InnerException}");
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
                    _logger.Warn($"AggregateException caught in Standard Output Thread. Inner Exception: {ex.InnerException}");
                }
                catch (Exception ex)
                {
                    result.ErrorOutput = $"Error while reading the process streams. {ex.Message}";
                }

                Debug.Assert(restrictedProcess.HasExited, "Restricted process didn't exit!");

                // Report exit code and total process working time
                result.ExitCode = restrictedProcess.ExitCode;
                result.TimeWorked = restrictedProcess.ExitTime - restrictedProcess.StartTime;
                result.PrivilegedProcessorTime = restrictedProcess.PrivilegedProcessorTime;
                result.UserProcessorTime = restrictedProcess.UserProcessorTime;
            }

            return result;
        }
    }
}
