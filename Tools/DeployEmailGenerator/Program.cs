namespace DeployEmailGenerator;

using DeployEmailGenerator.Models;
using DeployEmailGenerator.Response;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

public class Program
{
    private static readonly List<DeployEmailGenerator.Models.Program.ProjectMeta> Projects =
    [
        new DeployEmailGenerator.Models.Program.ProjectMeta
        {
            Number = 0,
            Name = "alpha.judge.softuni.org",
            Label = "Alpha",
            Url = "https://alpha.judge.softuni.org / https://dev.alpha.judge.softuni.org",
        },
        new DeployEmailGenerator.Models.Program.ProjectMeta
        {
            Number = 1,
            Name = "judge.softuni.org",
            Label = "Legacy Judge",
            Url = "https://judge.softuni.org / https://dev.judge.softuni.org",
        },
    ];

    private static string forDeployMilestoneNodeId;
    private static string doneMilestoneNodeId;
    private static string twoFactorToken;
    private static string defaultSavePath;
    private static string defaultSavePathPreDeploy;

    public static void Main()
    {
        var builder = new ConfigurationBuilder().AddJsonFile("appsettings.json", false, true);

        var config = builder.Build();
        forDeployMilestoneNodeId = config.GetRequiredSection("GitHub:ForDeployMilestoneNodeId").Value;
        doneMilestoneNodeId = config.GetRequiredSection("GitHub:DoneMilestoneNodeId").Value;
        twoFactorToken = config.GetRequiredSection("GitHub:Token").Value;
        defaultSavePath = config.GetRequiredSection("DefaultSavePath").Value;
        defaultSavePathPreDeploy = config.GetRequiredSection("DefaultSavePathPreDeploy").Value;

        Console.Write("Please select email type: 0 predeploy, 1 deploy:");
        EmailType emailType;
        var parsed = Enum.TryParse(Console.ReadLine(), out emailType);

        if (!parsed)
        {
            emailType = EmailType.Deploy;
        }

        Console.OutputEncoding = Encoding.UTF8;

        var projects = string.Join(Environment.NewLine, Program.Projects.Select(p => $"Number: {p.Number}, Name: {p.Name}"));
        Console.WriteLine($"Please select project numbers from the list bellow, separated by \",\"{Environment.NewLine}{projects}");

        var selectedProjectsInput = Console.ReadLine();
        var projectIds = selectedProjectsInput!.Split(',')
            .Select(s => int.TryParse(s, out var number) ? number : 0)
            .ToArray();

        var projectsToFilter = Projects.Where(p => projectIds.Contains(p.Number)).ToList();

        var query = @"
            query {
                node(id: ""milestoneNodeId"") {
                    ... on Milestone {
                        issues(states: CLOSED, first:150) {
                            nodes {
                                id
                                url
                                title,  labels(first:50) {
                                    edges {
                                      node {
                                        name
                                      }
                                    }
                                  }
                            }
                        }
                    }
                }
        }";

        var queryWithData = query
            .Replace("milestoneNodeId", forDeployMilestoneNodeId);

        var issuesResponse = GetIssuesMetaData(queryWithData);

        if (issuesResponse == null)
        {
            Console.WriteLine("No issues found");
            return;
        }

        var filteredProjects = FilterProjects(projectsToFilter, issuesResponse);

        var completeEmail = GenerateEmailContent(emailType, filteredProjects);

        Console.WriteLine(completeEmail);

        Console.WriteLine();

        SaveEmailContent(emailType, completeEmail);

        Console.WriteLine();

        if (emailType == EmailType.Deploy)
        {
            PromptForMovingIssues(filteredProjects);
        }

        Console.ReadLine();
    }

    private static GraphQlResponse GetIssuesMetaData(string query)
    {
        var responseJson = SendApiRequest(query).GetAwaiter().GetResult();

        // Process the response
        if (responseJson != null)
        {
            var responseData = JsonConvert.DeserializeObject<GraphQlResponse>(responseJson);

            // Process the response data
            if (responseData != null && responseData.Data != null && responseData.Data.Node != null && responseData.Data.Node.Issues != null)
            {
                return responseData;
            }
        }

        return null;
    }

    private static void SaveEmailContent(EmailType emailType, string completeEmail)
    {
        var savePath = emailType == EmailType.Predeploy
            ? defaultSavePathPreDeploy
            : defaultSavePath;
        try
        {
            File.WriteAllText(savePath, completeEmail);
            Console.WriteLine(
                DeployEmailGeneratorConstants.EmailDraftSavedSuccessMessage,
                savePath);
        }
        catch (Exception)
        {
            Console.WriteLine("File could not be saved on the system");
        }
    }

    private static async Task<string> SendApiRequest(string query)
    {
        var endpoint = "https://api.github.com/graphql";

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", twoFactorToken);
        client.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("AppName", "1.0"));

        // Construct the GraphQL request
        var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
        var requestBody = new { query };
        request.Content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

        // Send the request and retrieve the response
        var response = await client.SendAsync(request);
        var responseJson = await response.Content.ReadAsStringAsync();

        // Process the response
        if (response.IsSuccessStatusCode)
        {
            return responseJson;
        }

        Console.WriteLine($"Request failed: {response.StatusCode}");

        return null;
    }

    private static List<DeployEmailGenerator.Models.Program.ProjectMeta> FilterProjects(List<DeployEmailGenerator.Models.Program.ProjectMeta> projectsToFilter, GraphQlResponse issuesResponse)
    {
        foreach (var project in projectsToFilter)
        {
            project.Nodes = issuesResponse.Data.Node.Issues.Nodes
                .FindAll(issue => issue.Labels.Edges.Any(edge => edge.Node.Name == project.Label));
        }

        return projectsToFilter.Where(p => p.Nodes.Count != 0).ToList();
    }

    private static string GenerateEmailContent(EmailType emailType, List<DeployEmailGenerator.Models.Program.ProjectMeta> projects)
    {
        var emailContentTemplate = emailType == EmailType.Deploy
            ? DeployEmailGeneratorConstants.EmailTemplate
            : DeployEmailGeneratorConstants.EmailTemplatePreDeploy;

        var issueContent = new StringBuilder();

        foreach (var project in projects)
        {
            issueContent.Append(null, $"" +
                                      $"{project.Name}:{Environment.NewLine}" +
                                      $"{string.Join(Environment.NewLine, project.Nodes.Select(x => $"{x.Title} - {x.Url}"))}" +
                                      $"{Environment.NewLine}" +
                                      $"{Environment.NewLine}");
        }

        var completeEmail = string.Format(
            null,
            emailContentTemplate,
            string.Join(", ", projects.Select(p => p.Name)),
            string.Join(Environment.NewLine, projects.Select(p => p.Url)),
            issueContent);

        return completeEmail;
    }

    private static void PromptForMovingIssues(IEnumerable<DeployEmailGenerator.Models.Program.ProjectMeta> projects)
    {
        while (true)
        {
            Console.Write("Do you want to move issues to \"Done\": Yes/No:");

            var shouldMoveIssuesInput = Console.ReadLine();

            var shouldMoveIssues = (shouldMoveIssuesInput!.Equals("yes", StringComparison.OrdinalIgnoreCase) ||
                                    shouldMoveIssuesInput.Equals("y", StringComparison.OrdinalIgnoreCase));

            var shouldNotMoveIssues = (shouldMoveIssuesInput.Equals("no", StringComparison.OrdinalIgnoreCase) ||
                                       shouldMoveIssuesInput.Equals("n", StringComparison.OrdinalIgnoreCase));

            if (shouldMoveIssues)
            {
                Console.WriteLine("Moving issues, please wait for confirmation of successful move to \"Done\".");
                MoveIssuesToDone(projects);
            }
            else if (shouldNotMoveIssues)
            {
                Console.WriteLine("Issues were not moved to \"Done\".");
            }
            else
            {
                Console.WriteLine("Invalid input!");
                continue;
            }

            break;
        }
    }

    private static void MoveIssuesToDone(IEnumerable<DeployEmailGenerator.Models.Program.ProjectMeta> projects)
    {
        var issueIds = projects.SelectMany(x => x.Nodes).Distinct().Select(x => x.Id);

        foreach (var issueId in issueIds)
        {
            var mutation = @"
                mutation {
                    updateIssue(input:{id:""issueId"", milestoneId:""milestoneNodeId""}) {
                        issue {
                            id
                        }
                    }
                }";

            var mutationWithData = mutation
                .Replace("issueId", issueId)
                .Replace("milestoneNodeId", doneMilestoneNodeId);

            var responseJson = SendApiRequest(mutationWithData).GetAwaiter().GetResult();

            if (responseJson == null)
            {
                Console.WriteLine("Not all issues could be moved to \"Done\".");
                return;
            }
        }

        Console.WriteLine("Issues were moved to \"Done\" successfully.");
    }
}