namespace OJS.Servers.Infrastructure;

using Elastic.Transport;
using OJS.Services.Infrastructure.Configurations;
using System;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;

public static class ElasticsearchHelper
{
    public static Func<object, X509Certificate, X509Chain, SslPolicyErrors, bool> GetServerCertificateValidationCallback()
        => (_, _, _, _) => true; // Disable certificate validation.

    public static AuthorizationHeader GetElasticsearchAuthentication(ElasticsearchConfig config)
        => new BasicAuthentication(config.Username, config.Password);
}