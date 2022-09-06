namespace OJS.Services.Common;

using SoftUni.Services.Infrastructure;
using System;
using System.Threading.Tasks;

public interface IMeasureService
    : IService
{
    Task<T> Measure<T>(Func<Task<T>> func, string name);
}