namespace DeployEmailGenerator.Response;

using Newtonsoft.Json;
using System.Collections.Generic;

public class GraphQlResponse
{
    [JsonProperty("data")]
    public GraphQlData Data { get; set; }
}

public class GraphQlData
{
    [JsonProperty("node")]
    public MilestoneNode Node { get; set; }
}

public class MilestoneNode
{
    [JsonProperty("issues")]
    public IssueConnection Issues { get; set; }
}

public class IssueConnection
{
    [JsonProperty("nodes")]
    public List<Issue> Nodes { get; set; }
}

public class Issue
{
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("url")]
    public string Url { get; set; }

    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("labels")]
    public LabelConnection Labels { get; set; }
}

public class LabelConnection
{
    [JsonProperty("edges")]
    public List<LabelEdge> Edges { get; set; }
}

public class LabelEdge
{
    [JsonProperty("node")]
    public LabelNode Node { get; set; }
}

public class LabelNode
{
    [JsonProperty("name")]
    public string Name { get; set; }
}