namespace DeployEmailGenerator.Models;

using DeployEmailGenerator.Response;
using System.Collections.Generic;

public static partial class Program
{
    public class ProjectMeta
    {
        public int Number { get; set; }

        public string Name { get; set; }

        public string Url { get; set; }

        public string Label { get; set; }

        public List<Issue> Nodes { get; set; }
    }
}