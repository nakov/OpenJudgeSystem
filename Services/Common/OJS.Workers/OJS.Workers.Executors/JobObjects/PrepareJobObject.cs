namespace OJS.Workers.Executors.JobObjects
{
    using System;

    internal static class PrepareJobObject
    {
        public static ExtendedLimitInformation GetExtendedLimitInformation(int maximumTime, int maximumMemory)
        {
            var info = new BasicLimitInformation
            {
                LimitFlags =
                    (int)(LimitFlags.JobObjectLimitJobMemory
                     //// The following two flags are causing the process to have unexpected behavior
                     //// | LimitFlags.JOB_OBJECT_LIMIT_JOB_TIME
                     //// | LimitFlags.JOB_OBJECT_LIMIT_PROCESS_TIME
                     | LimitFlags.JobObjectLimitActiveProcess
                     | LimitFlags.JobObjectLimitDieOnUnhandledException
                     | LimitFlags.JobObjectLimitKillOnJobClose),
                PerJobUserTimeLimit = maximumTime, // TODO: Remove or rework
                PerProcessUserTimeLimit = maximumTime,
                ActiveProcessLimit = 1,
            };

            var extendedInfo = new ExtendedLimitInformation
            {
                BasicLimitInformation = info,
                JobMemoryLimit = (UIntPtr)maximumMemory,
                IoInfo =
                {
                    ReadTransferCount = 0,
                    ReadOperationCount = 0,
                    WriteOperationCount = 0,
                    WriteTransferCount = 0,
                },
            };

            return extendedInfo;
        }

        public static BasicUiRestrictions GetUiRestrictions()
        {
            var restrictions = new BasicUiRestrictions
                                   {
                                       UiRestrictionsClass =
                                           (int)(UiRestrictionFlags.JobObjectUilimitDesktop
                                            | UiRestrictionFlags.JobObjectUilimitDisplaysettings
                                            | UiRestrictionFlags.JobObjectUilimitExitwindows
                                            | UiRestrictionFlags.JobObjectUilimitGlobalatoms
                                            | UiRestrictionFlags.JobObjectUilimitHandles
                                            | UiRestrictionFlags.JobObjectUilimitReadclipboard
                                            | UiRestrictionFlags.JobObjectUilimitSystemparameters
                                            | UiRestrictionFlags.JobObjectUilimitWriteclipboard),
                                   };

            return restrictions;
        }
    }
}
