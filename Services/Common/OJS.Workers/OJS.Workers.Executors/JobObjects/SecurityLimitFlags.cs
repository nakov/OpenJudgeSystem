namespace OJS.Workers.Executors.JobObjects
{
    public enum SecurityLimitFlags
    {
        /// <summary>
        /// Prevents any process in the job from using a token that specifies the local administrators group.
        /// </summary>
        JobObjectSecurityNoAdmin = 0x00000001,

        /// <summary>
        /// Prevents any process in the job from using a token that was not created with the CreateRestrictedToken function.
        /// </summary>
        JobObjectSecurityRestrictedToken = 0x00000002,

        /// <summary>
        /// Forces processes in the job to run under a specific token. Requires a token handle in the JobToken member.
        /// </summary>
        JobObjectSecurityOnlyToken = 0x00000004,

        /// <summary>
        /// Applies a filter to the token when a process impersonates a client. Requires at least one of the following members to be set: SidsToDisable, PrivilegesToDelete, or RestrictedSids.
        /// </summary>
        JobObjectSecurityFilterTokens = 0x00000008,
    }
}
