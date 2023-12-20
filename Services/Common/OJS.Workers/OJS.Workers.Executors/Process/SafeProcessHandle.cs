#nullable disable
namespace OJS.Workers.Executors.Process
{
    using System;
    using System.Diagnostics;
    using System.Security;

    using Microsoft.Win32.SafeHandles;

    [SuppressUnmanagedCodeSecurity]
    public sealed class SafeProcessHandle : SafeHandleZeroOrMinusOneIsInvalid
    {
#pragma warning disable SA1309
        private static SafeProcessHandle _invalidHandle = new SafeProcessHandle(IntPtr.Zero);
#pragma warning restore SA1309

        // Note that OpenProcess returns 0 on failure
        internal SafeProcessHandle()
            : base(true)
        {
        }

        internal SafeProcessHandle(IntPtr handle)
            : base(true) =>
            this.SetHandle(handle);

        internal void InitialSetHandle(IntPtr h)
        {
            Debug.Assert(this.IsInvalid, "Safe handle should only be set once");
            this.handle = h;
        }

        protected override bool ReleaseHandle() => NativeMethods.CloseHandle(this.handle);
    }
}
