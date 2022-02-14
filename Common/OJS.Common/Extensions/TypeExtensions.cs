namespace OJS.Common.Extensions;

using System;

public static class TypeExtensions
{
    public static string GetProjectName(this Type type)
    {
        if (type == null)
        {
            throw new ArgumentNullException(nameof(type), "Could not load project name. Type is not provided.");
        }

        // Project name is always the second index, if all conventions are followed.
        // Interactive.Servers.Courses.Controllers for example.
        var projectName = type.Namespace?.Split('.')[2];

        if (projectName == null)
        {
            throw new ArgumentException($"{type.Name} should be declared in a namespace.");
        }

        return projectName;
    }
}