namespace OJS.Services.Common.Mapping;

using AutoMapper;
using System.Collections.Generic;

public abstract class ValuesMapOrDefaultMemberValueResolver<TSource, TDestination> : IMemberValueResolver<object, object, TSource, TDestination>
{
    protected abstract IDictionary<TSource, TDestination> NameToValueMap { get; }
    protected abstract TDestination DefaultValue { get; }

    public TDestination Resolve(
        object source,
        object destination,
        TSource sourceMember,
        TDestination destMember,
        ResolutionContext context)
        => this.NameToValueMap.TryGetValue(sourceMember, out TDestination? value)
            ? value
            : this.DefaultValue;
}