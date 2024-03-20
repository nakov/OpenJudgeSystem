namespace OJS.Workers.Executors
{
    using System;
    using System.Collections.Generic;
    using System.IO;

    using OJS.Workers.Common;
    using System.ComponentModel;

    public abstract class ProcessExecutor : IExecutor
    {
#pragma warning disable SA1401
        protected readonly ITasksService TasksService;
#pragma warning restore SA1401

        private const int TimeIntervalBetweenTwoResourceConsumptionRequests = 10;
        private const int MinimumMemoryLimitInBytes = 5 * 1024 * 1024;

        private readonly int baseTimeUsed;
        private readonly int baseMemoryUsed;
        private int timeLimit;
        private int memoryLimit;

        /// <summary>
        /// Initializes a new instance of the <see cref="ProcessExecutor"/> class. with base time and memory used.
        /// </summary>
        /// <param name="baseTimeUsed">The base time in milliseconds added to the time limit when executing.</param>
        /// <param name="baseMemoryUsed">The base memory in bytes added to the memory limit when executing.</param>
        /// <param name="tasksService">Service for running tasks in the background.</param>
        protected ProcessExecutor(
            int baseTimeUsed,
            int baseMemoryUsed,
            ITasksService tasksService)
        {
            this.baseTimeUsed = baseTimeUsed;
            this.baseMemoryUsed = baseMemoryUsed;
            this.TasksService = tasksService;
        }

        public async Task<ProcessExecutionResult> Execute(
            string fileName,
            string inputData,
            int processTimeLimit,
            int processMemoryLimit,
            IEnumerable<string>? executionArguments = null,
            string? workingDirectory = null,
            bool useProcessTime = false,
            bool useSystemEncoding = false,
            bool dependOnExitCodeForRunTimeError = false,
            double timeoutMultiplier = 1.5)
        {
            this.timeLimit = processTimeLimit;
            this.memoryLimit = processMemoryLimit;

            workingDirectory = workingDirectory ?? new FileInfo(fileName).DirectoryName;

            this.BeforeExecute();

            var processExecutionResult = await this.InternalExecute(
                fileName,
                inputData,
                this.timeLimit,
                executionArguments,
                workingDirectory,
                useSystemEncoding,
                timeoutMultiplier);

            this.AfterExecute(
                useProcessTime,
                dependOnExitCodeForRunTimeError,
                processExecutionResult);

            return processExecutionResult;
        }

        protected abstract Task<ProcessExecutionResult> InternalExecute(
            string fileName,
            string inputData,
            int timeLimit,
            IEnumerable<string>? executionArguments,
            string? workingDirectory,
            bool useSystemEncoding,
            double timeoutMultiplier);

        protected TaskInfo StartResourceConsumptionSamplingThread(
            System.Diagnostics.Process process,
            ProcessExecutionResult result)
            => this.TasksService.RunWithInterval(
                TimeIntervalBetweenTwoResourceConsumptionRequests,
                () =>
                {
                    try
                    {
                        if (process.HasExited)
                        {
                            return;
                        }

                        result.PrivilegedProcessorTime = process.PrivilegedProcessorTime;
                        result.UserProcessorTime = process.UserProcessorTime;
                        result.MemoryUsed = Math.Max(result.MemoryUsed, process.PeakWorkingSet64);
                    }
                    catch (Exception e) when (e is InvalidOperationException or Win32Exception)
                    {
                        // Process has exited or is not running anymore
                        // Do nothing, as result will be calculated from the process exit time
                    }
                });

        private static bool IsExitCodeCritical(int exitCode)
            => // Add more error codes here, as they are discovered to cause runtime errors without any output
                exitCode is <= -1 // Negative exit code - process was killed
                or 139; // SIGSEGV signal from Unix OS - invalid memory reference (segmentation fault)

        private void BeforeExecute()
        {
            this.timeLimit += this.baseTimeUsed;
            this.memoryLimit += this.baseMemoryUsed;

            if (this.memoryLimit < MinimumMemoryLimitInBytes)
            {
                this.memoryLimit = MinimumMemoryLimitInBytes;
            }
        }

        private void AfterExecute(
            bool useProcessTime,
            bool dependOnExitCodeForRunTimeError,
            ProcessExecutionResult result)
        {
            if ((useProcessTime && result.TimeWorked.TotalMilliseconds > this.timeLimit) ||
                result.TotalProcessorTime.TotalMilliseconds > this.timeLimit)
            {
                result.Type = ProcessExecutionResultType.TimeLimit;
            }

            if (result.MemoryUsed > this.memoryLimit)
            {
                result.Type = ProcessExecutionResultType.MemoryLimit;
            }

            if (!string.IsNullOrEmpty(result.ErrorOutput) ||
                (dependOnExitCodeForRunTimeError && IsExitCodeCritical(result.ExitCode)))
            {
                result.Type = ProcessExecutionResultType.RunTimeError;

                if (string.IsNullOrEmpty(result.ErrorOutput))
                {
                    result.ErrorOutput = $"Critical runtime error has occured. Error code: {result.ExitCode}";
                }
            }

            result.ApplyTimeAndMemoryOffset(this.baseTimeUsed, this.baseMemoryUsed);
        }
    }
}
