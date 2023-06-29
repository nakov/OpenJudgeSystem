﻿namespace OJS.Web
{
    using System.Net;

    public partial class Startup
    {
        public void ConfigureTls()
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
        }
    }
}