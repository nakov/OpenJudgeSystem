namespace OJS.Workers.Executors.Process
{
    using System;
    using System.Security;
    using System.Security.Permissions;

    using Microsoft.Win32.SafeHandles;

    [SuppressUnmanagedCodeSecurity]
#pragma warning disable SYSLIB0003
    [HostProtection(SecurityAction.LinkDemand, MayLeakOnAbort = true)]
#pragma warning restore SYSLIB0003
    public sealed class SafeLocalMemHandle : SafeHandleZeroOrMinusOneIsInvalid
    {
        internal SafeLocalMemHandle()
            : base(true)
        {
        }

#pragma warning disable SYSLIB0003
        [SecurityPermission(SecurityAction.LinkDemand, UnmanagedCode = true)]
#pragma warning restore SYSLIB0003
        internal SafeLocalMemHandle(IntPtr existingHandle, bool ownsHandle)
            : base(ownsHandle)
            => this.SetHandle(existingHandle);

        protected override bool ReleaseHandle()
            => NativeMethods.LocalFree(this.handle) == IntPtr.Zero;
    }
}
