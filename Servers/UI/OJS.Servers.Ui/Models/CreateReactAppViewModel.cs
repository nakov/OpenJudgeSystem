namespace OJS.Servers.Ui.Models
{
    using Microsoft.AspNetCore.Http;
    using System;
    using System.IO;
    using System.Net;
    using System.Text.RegularExpressions;

    public class CreateReactAppViewModel
    {
        // ReSharper disable once InconsistentNaming
        private static readonly Regex _parser = new(
            @"<head>(?<HeadContent>.*)</head>\s*<body>(?<BodyContent>.*)</body>",
            RegexOptions.IgnoreCase | RegexOptions.Singleline);

        public string HeadContent { get; set; }
        public string BodyContent { get; set; }

        public CreateReactAppViewModel(HttpContext context)
        {
            var request = WebRequest.Create(
                context.Request.Scheme + "://" + context.Request.Host +
                context.Request.PathBase + "/index.html");


            var response = request.GetResponse();
            var stream = response.GetResponseStream();
            var reader = new StreamReader(
                stream ?? throw new InvalidOperationException(
                    "The create-react-app build output could not be found in " +
                    "/ClientApp/build. You probably need to run npm run build. " +
                    "For local development, consider npm start."));

            var htmlFileContent = reader.ReadToEnd();
            var matches = _parser.Matches(htmlFileContent);

            if (matches.Count != 1)
            {
                throw new InvalidOperationException(
                    "The create-react-app build output does not appear " +
                    "to be a valid html file.");
            }

            var match = matches[0];

            this.HeadContent = match.Groups["HeadContent"].Value;
            this.BodyContent = match.Groups["BodyContent"].Value;
        }
    }
}