namespace OJS.Common.Utils;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public static class TasksUtils
{
    public static async Task<(T1, T2)> WhenAll<T1, T2>(Task<T1> task1, Task<T2> task2)
    {
        await Task.WhenAll(task1, task1);
        return (task1.Result, task2.Result);
    }

    public static async Task<(T1, T2, T3)> WhenAll<T1, T2, T3>(Task<T1> task1, Task<T2> task2, Task<T3> task3)
    {
        await Task.WhenAll(task1, task1, task3);
        return (task1.Result, task2.Result, task3.Result);
    }

    public static async Task<(T1, T2, T3, T4, T5)> WhenAll<T1, T2, T3, T4, T5>(
        Task<T1> task1,
        Task<T2> task2,
        Task<T3> task3,
        Task<T4> task4,
        Task<T5> task5)
    {
        await Task.WhenAll(task1, task2, task3, task4, task5);
        return (task1.Result, task2.Result, task3.Result, task4.Result, task5.Result);
    }

    public static async Task<IEnumerable<T>> WhenAll<T>(params Task<T>[] tasks)
    {
        await Task.WhenAll(tasks);
        return tasks.Select(x => x.Result);
    }

    public static async Task<IEnumerable<T>> WhenAll<T>(IEnumerable<Task<T>> tasks)
    {
        var tasksList = tasks.ToList();
        await Task.WhenAll(tasksList);
        return tasksList.Select(x => x.Result);
    }

    public static async Task WhenAllSequential(params Func<Task>[] funcs)
    {
        foreach (var func in funcs)
        {
            await func();
        }
    }
}