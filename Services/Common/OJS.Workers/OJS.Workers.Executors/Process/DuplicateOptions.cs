namespace OJS.Workers.Executors.Process
{
    using System;

    [Flags]
    public enum DuplicateOptions : uint
    {
        /// <summary>
        /// Closes the source handle. This occurs regardless of any error status returned.
        /// </summary>
        DuplicateCloseSource = 0x00000001,

        /// <summary>
        /// Ignores the dwDesiredAccess parameter. The duplicate handle has the same access as the source handle.
        /// </summary>
        DuplicateSameAccess = 0x00000002,
    }
}
