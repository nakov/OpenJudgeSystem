namespace OJS.Workers.Executors.Process
{
    using System;
    using System.Diagnostics.CodeAnalysis;
    using System.Runtime.ConstrainedExecution;
    using System.Runtime.InteropServices;
    using System.Runtime.Versioning;

    using Microsoft.Win32.SafeHandles;

    public static class NativeMethods
    {
        public const int Synchronize = 0x00100000;
        public const int ProcessTerminate = 0x0001;
        public const int StillActive = 0x00000103;

        public const uint StandardRightsRequired = 0x000F0000;
        public const uint StandardRightsRead = 0x00020000;

        public const uint TokenAssignPrimary = 0x0001;
        public const uint TokenDuplicate = 0x0002;
        public const uint TokenImpersonate = 0x0004;
        public const uint TokenQuery = 0x0008;
        public const uint TokenQuerySource = 0x0010;
        public const uint TokenAdjustPrivileges = 0x0020;
        public const uint TokenAdjustGroups = 0x0040;
        public const uint TokenAdjustDefault = 0x0080;
        public const uint TokenAdjustSessionid = 0x0100;
        public const uint TokenRead = StandardRightsRead | TokenQuery;
        public const uint TokenAllAccess =
            StandardRightsRequired | TokenAssignPrimary | TokenDuplicate | TokenImpersonate | TokenQuery
             | TokenQuerySource | TokenAdjustPrivileges | TokenAdjustGroups | TokenAdjustDefault
             | TokenAdjustSessionid;

        // Group related SID Attributes
        public const uint SeGroupMandatory = 0x00000001;
        public const uint SeGroupEnabledByDefault = 0x00000002;
        public const uint SeGroupEnabled = 0x00000004;
        public const uint SeGroupOwner = 0x00000008;
        public const uint SeGroupUseForDenyOnly = 0x00000010;
        public const uint SeGroupIntegrity = 0x00000020;
        public const uint SeGroupIntegrityEnabled = 0x00000040;
        public const uint SeGroupLogonId = 0xC0000000;
        public const uint SeGroupResource = 0x20000000;
        public const uint SeGroupValidAttributes = SeGroupMandatory |
            SeGroupEnabledByDefault | SeGroupEnabled | SeGroupOwner |
            SeGroupUseForDenyOnly | SeGroupLogonId | SeGroupResource |
            SeGroupIntegrity | SeGroupIntegrityEnabled;

        public const int SaferScopeidMachine = 1;
        public const int SaferScopeidUser = 2;

        public const int SaferLevelidDisallowed = 0x00000;
        public const int SaferLevelidUntrusted = 0x1000;
        public const int SaferLevelidConstrained = 0x10000;
        public const int SaferLevelidNormaluser = 0x20000;
        public const int SaferLevelidFullytrusted = 0x40000;

        public const int SaferLevelOpen = 1;

        [SuppressMessage("StyleCop.CSharp.MaintainabilityRules", "SA1401:FieldsMustBePrivate", Justification = "Reviewed. Suppression is OK here.")]
        public static SidIdentifierAuthority securityMandatoryLabelAuthority =
            new SidIdentifierAuthority(new byte[] { 0, 0, 0, 0, 0, 16 });

        [DllImport("advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        [System.Security.SuppressUnmanagedCodeSecurityAttribute]
        [ResourceExposure(ResourceScope.Machine)]
        internal static extern bool CreateProcessAsUser(
            IntPtr hToken,
            string lpApplicationName,
            string lpCommandLine,
            SecurityAttributes lpProcessAttributes,
            SecurityAttributes lpThreadAttributes,
            bool bInheritHandles,
            uint dwCreationFlags,
            IntPtr lpEnvironment,
            string lpCurrentDirectory,
            StartupInfo lpStartupInfo,
            out ProcessInformation lpProcessInformation);

        [DllImport("kernel32.dll")]
        internal static extern uint ResumeThread(IntPtr hThread);

        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        [ResourceExposure(ResourceScope.Process)]
        internal static extern bool CreatePipe(
            out SafeFileHandle hReadPipe,
            out SafeFileHandle hWritePipe,
            SecurityAttributes lpPipeAttributes,
            int nSize);

        [DllImport("kernel32.dll")]
        internal static extern IntPtr GetCurrentProcess();

        [DllImport("kernel32.dll", SetLastError = true)]
        internal static extern uint WaitForSingleObject(IntPtr hHandle, uint dwMilliseconds);

        [DllImport("kernel32.dll", CharSet = CharSet.Ansi, SetLastError = true, BestFitMapping = false)]
        [ResourceExposure(ResourceScope.Machine)]
        internal static extern bool DuplicateHandle(
            HandleRef hSourceProcessHandle,
            SafeHandle hSourceHandle,
            HandleRef hTargetProcess,
            out SafeFileHandle targetHandle,
            int dwDesiredAccess,
            bool bInheritHandle,
            int dwOptions);

        [DllImport("kernel32.dll", CharSet = CharSet.Ansi, SetLastError = true, BestFitMapping = false)]
        [ResourceExposure(ResourceScope.Machine)]
        internal static extern bool DuplicateHandle(
            HandleRef hSourceProcessHandle,
            SafeHandle hSourceHandle,
            HandleRef hTargetProcess,
            out SafeWaitHandle targetHandle,
            int dwDesiredAccess,
            bool bInheritHandle,
            int dwOptions);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        internal static extern bool DuplicateHandle(
            IntPtr hSourceProcessHandle,
            IntPtr hSourceHandle,
            IntPtr hTargetProcessHandle,
            out IntPtr lpTargetHandle,
            uint dwDesiredAccess,
            [MarshalAs(UnmanagedType.Bool)] bool bInheritHandle,
            uint dwOptions);

        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        [ResourceExposure(ResourceScope.Machine)]
        internal static extern bool TerminateProcess(SafeProcessHandle processHandle, int exitCode);

        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        [ResourceExposure(ResourceScope.None)]
        internal static extern bool GetExitCodeProcess(SafeProcessHandle processHandle, out int exitCode);

        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        [ResourceExposure(ResourceScope.None)]
        internal static extern bool GetProcessTimes(
            SafeProcessHandle handle,
            out long creation,
            out long exit,
            out long kernel,
            out long user);

        /// <summary>
        /// The function opens the access token associated with a process.
        /// </summary>
        /// <param name="processHandle">A handle to the process whose access token is opened.</param>
        /// <param name="desiredAccess">Specifies an access mask that specifies the requested types of access to the access token.</param>
        /// <param name="tokenHandle">Outputs a handle that identifies the newly opened access token when the function returns.</param>
        [DllImport("advapi32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        internal static extern bool OpenProcessToken(IntPtr processHandle, uint desiredAccess, out IntPtr tokenHandle);

        [DllImport("advapi32.dll", SetLastError = true)]
        internal static extern bool CreateRestrictedToken(
            IntPtr existingTokenHandle,
            CreateRestrictedTokenFlags createRestrictedTokenFlags,
            int disableSidCount,
            SidAndAttributes[] sidsToDisable,
            int deletePrivilegeCount,
            LuidAndAttributes[] privilegesToDelete,
            int restrictedSidCount,
            SidAndAttributes[] sidsToRestrict,
            out IntPtr newTokenHandle);

        [DllImport("advapi32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        internal static extern bool ConvertStringSidToSid(string stringSid, out IntPtr ptrSid);

        /// <summary>
        /// The function sets various types of information for a specified
        /// access token. The information that this function sets replaces
        /// existing information. The calling process must have appropriate
        /// access rights to set the information.
        /// </summary>
        /// <param name="hToken"> A handle to the access token for which information is to be set.</param>
        /// <param name="tokenInfoClass">A value from the TOKEN_INFORMATION_CLASS enumerated type that identifies the type of information the function sets.</param>
        /// <param name="pTokenInfo">A pointer to a buffer that contains the information set in the access token.</param>
        /// <param name="tokenInfoLength">Specifies the length, in bytes, of the buffer pointed to by TokenInformation.</param>
        [DllImport("advapi32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        internal static extern bool SetTokenInformation(
            IntPtr hToken,
            TokenInformationClass tokenInfoClass,
            IntPtr pTokenInfo,
            int tokenInfoLength);

        /// <summary>
        /// The function returns the length, in bytes, of a valid security
        /// identifier (SID).
        /// </summary>
        /// <param name="pSid">A pointer to the SID structure whose length is returned.</param>
        /// <returns>
        /// If the SID structure is valid, the return value is the length, in
        /// bytes, of the SID structure.
        /// </returns>
        [DllImport("advapi32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        internal static extern int GetLengthSid(IntPtr pSid);

        /// <summary>
        /// The AllocateAndInitializeSid function allocates and initializes a
        /// security identifier (SID) with up to eight subauthorities.
        /// </summary>
        /// <param name="pIdentifierAuthority">A reference of a SID_IDENTIFIER_AUTHORITY structure. This structure provides the top-level identifier authority value to set in the SID.</param>
        /// <param name="nSubAuthorityCount">Specifies the number of subauthorities to place in the SID.</param>
        /// <param name="dwSubAuthority0">0Subauthority value to place in the SID.</param>
        /// <param name="dwSubAuthority1">1Subauthority value to place in the SID.</param>
        /// <param name="dwSubAuthority2">2Subauthority value to place in the SID.</param>
        /// <param name="dwSubAuthority3">3Subauthority value to place in the SID.</param>
        /// <param name="dwSubAuthority4">4ubauthority value to place in the SID.</param>
        /// <param name="dwSubAuthority5">5ubauthority value to place in the SID.</param>
        /// <param name="dwSubAuthority6">6Subauthority value to place in the SID.</param>
        /// <param name="dwSubAuthority7">7Subauthority value to place in the SID.</param>
        /// <param name="pSid">Outputs the allocated and initialized SID structure.</param>
        /// <returns>
        /// If the function succeeds, the return value is true. If the
        /// function fails, the return value is false. To get extended error
        /// information, call GetLastError.
        /// </returns>
        [DllImport("advapi32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        internal static extern bool AllocateAndInitializeSid(
            ref SidIdentifierAuthority pIdentifierAuthority,
            byte nSubAuthorityCount,
            int dwSubAuthority0,
            int dwSubAuthority1,
            int dwSubAuthority2,
            int dwSubAuthority3,
            int dwSubAuthority4,
            int dwSubAuthority5,
            int dwSubAuthority6,
            int dwSubAuthority7,
            out IntPtr pSid);

        [DllImport("ntdll.dll", CharSet = CharSet.Auto)]
        [ResourceExposure(ResourceScope.None)]
        internal static extern int NtQuerySystemInformation(int query, IntPtr dataPtr, int size, out int returnedSize);

        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        [ResourceExposure(ResourceScope.Machine)]
        internal static extern SafeProcessHandle OpenProcess(int access, bool inherit, int processId);

        [DllImport("psapi.dll", EntryPoint = "GetProcessMemoryInfo")]
        [return: MarshalAs(UnmanagedType.Bool)]
        internal static extern bool GetProcessMemoryInfo([In] IntPtr process, [Out] out ProcessMemoryCounters ppsmemCounters, uint cb);

        [DllImport("advapi32.dll", SetLastError = true)]
        internal static extern bool SaferCloseLevel(IntPtr hLevelHandle);

        [DllImport("advapi32.dll", SetLastError = true)]
        internal static extern bool SaferCreateLevel(int dwScopeId, int dwLevelId, int openFlags, out IntPtr pLevelHandle, IntPtr lpReserved);

        [DllImport("advapi32.dll", SetLastError = true)]
        internal static extern bool SaferComputeTokenFromLevel(IntPtr levelHandle, IntPtr inAccessToken, out IntPtr outAccessToken, int dwFlags, IntPtr lpReserved);

        [DllImport("kernel32.dll", ExactSpelling = true, CharSet = CharSet.Auto, SetLastError = true)]
#pragma warning disable SYSLIB0004
        [ReliabilityContract(Consistency.WillNotCorruptState, Cer.Success)]
#pragma warning restore SYSLIB0004
        [ResourceExposure(ResourceScope.None)]
        internal static extern bool CloseHandle(IntPtr handle);

        [DllImport("advapi32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        internal static extern bool LogonUser(string lpszUsername, string lpszDomain, string lpszPassword, int dwLogonType, int dwLogonProvider, ref IntPtr phToken);

        // SafeLocalMemHandle
        [DllImport("advapi32.dll", CharSet = CharSet.Auto, SetLastError = true, BestFitMapping = false)]
        internal static extern bool ConvertStringSecurityDescriptorToSecurityDescriptor([MarshalAs(UnmanagedType.LPWStr)]string stringSecurityDescriptor, int stringSdRevision, out SafeLocalMemHandle securityDescriptor, IntPtr securityDescriptorSize);

#pragma warning disable SYSLIB0004
        [ReliabilityContract(Consistency.WillNotCorruptState, Cer.Success)]
#pragma warning restore SYSLIB0004
        [DllImport("kernel32.dll")]
        internal static extern IntPtr LocalFree(IntPtr memoryHandler);
    }
}
