namespace OJS.Workers.Executors.Process
{
    public enum LogonType
    {
        Logon32LogonInteractive = 2,
        Logon32LogonNetwork,
        Logon32LogonBatch,
        Logon32LogonService,
        Logon32LogonUnlock = 7,
        Logon32LogonNetworkCleartext,
        Logon32LogonNewCredentials,
    }
}
