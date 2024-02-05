namespace OJS.Services.Common.Mapping;

using AutoMapper;
using OJS.Workers.Common.Models;
using System;

public class CompilerTypeMemberValueResolver : IMemberValueResolver<object, object, string?, CompilerType>
{
    public CompilerType Resolve(
        object source,
        object destination,
        string? sourceMember,
        CompilerType destMember,
        ResolutionContext context)
        => Enum.TryParse<CompilerType>(sourceMember, out var compilerType)
            ? compilerType
            : CompilerType.None;
}