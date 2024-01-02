#nullable disable
namespace OJS.Workers.Executors
{
    using System;
    using System.Collections.Generic;
    using System.IO;

    using OJS.Workers.Common;

    public abstract class ProcessExecutor : IExecutor
    {
#pragma warning disable SA1401
        protected readonly ITasksService TasksService;
#pragma warning restore SA1401

        private const int MemoryIntervalBetweenTwoMemoryConsumptionRequests = 45;
        private const int TimeIntervalBetweenTwoTimeConsumptionRequests = 10;
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
            IEnumerable<string> executionArguments = null,
            string workingDirectory = null,
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
            IEnumerable<string> executionArguments,
            string workingDirectory,
            bool useSystemEncoding,
            double timeoutMultiplier);

        protected TaskInfo StartMemorySamplingThread(
            IDisposable process,
            ProcessExecutionResult result)
        {
            var peakWorkingSetSize = default(long);

            var memorySamplingRunInBackgroundInfo = this.TasksService.RunWithInterval(
                MemoryIntervalBetweenTwoMemoryConsumptionRequests,
                () =>
                {
                    switch (process)
                    {
                        case System.Diagnostics.Process systemProcess:
                        {
                            if (systemProcess.HasExited)
                            {
                                return;
                            }

                            peakWorkingSetSize = systemProcess.PeakWorkingSet64;
                            break;
                        }
                    }

                    result.MemoryUsed = Math.Max(result.MemoryUsed, peakWorkingSetSize);
                });

            return memorySamplingRunInBackgroundInfo;
        }

        protected TaskInfo StartProcessorTimeSamplingThread(
            System.Diagnostics.Process process,
            ProcessExecutionResult result)
            => this.TasksService.RunWithInterval(
                TimeIntervalBetweenTwoTimeConsumptionRequests,
                () =>
                {
                    if (process.HasExited)
                    {
                        return;
                    }

                    result.PrivilegedProcessorTime = process.PrivilegedProcessorTime;
                    result.UserProcessorTime = process.UserProcessorTime;
                });

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
                (dependOnExitCodeForRunTimeError && result.ExitCode < -1))
            {
                result.Type = ProcessExecutionResultType.RunTimeError;
            }

            result.ApplyTimeAndMemoryOffset(this.baseTimeUsed, this.baseMemoryUsed);
        }
    }
}
