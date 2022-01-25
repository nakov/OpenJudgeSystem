namespace OJS.Services.Administration.Business.Extensions;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using FluentExtensions.Extensions;
using Microsoft.AspNetCore.Http;
using OJS.Common.Enumerations;
using OJS.Services.Administration.Models;
using System.Collections.Generic;
using System.Linq;

public static class AdminActionContextExtensions
{
    public static string GetFormValue(this AdminActionContext actionContext, AdditionalFormFields field)
        => actionContext.EntityDict[field.ToString()];

    public static IFormFile? GetFormFile(this AdminActionContext actionContext, AdditionalFormFields field)
        => actionContext.Files.SingleFiles.FirstOrDefault(f => f.Name == field.ToString());

    public static ProblemGroupType? GetProblemGroupType(this AdminActionContext actionContext)
        => actionContext.EntityDict[AdditionalFormFields.ProblemGroupType.ToString()].ToEnum<ProblemGroupType>();

    public static IEnumerable<CheckboxFormControlViewModel> GetSubmissionTypes(this AdminActionContext actionContext)
        => actionContext.EntityDict[AdditionalFormFields.SubmissionTypes.ToString()]
            .FromJson<IEnumerable<CheckboxFormControlViewModel>>();

    public static int? TryGetEntityId<TEntity>(this AdminActionContext actionContext)
        where TEntity : class
        => actionContext.EntityDict.TryGetEntityId<TEntity>();

    public static byte[] GetSolutionSkeleton(this AdminActionContext actionContext)
        => actionContext.EntityDict[AdditionalFormFields.SolutionSkeletonData.ToString()].Compress();

    public static int? TryGetEntityId<TEntity>(this IDictionary<string, string> entityDict)
        where TEntity : class
        => entityDict.TryGetValue(typeof(TEntity).Name + "Id", out var contestIdStr)
            ? int.Parse(contestIdStr)
            : null;
}