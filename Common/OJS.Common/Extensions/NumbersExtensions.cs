namespace OJS.Common.Extensions;

using System.Threading.Tasks;

public static class NumbersExtensions
{
    public static int ToInt(this decimal value)
        => (int)value;

    public static async Task<int> ToInt(this Task<decimal> value)
    {
        var result = await value;
        return result.ToInt();
    }

    public static int ToInt(this double value)
        => (int)value;

    public static async Task<int> ToInt(this Task<double> value)
    {
        var result = await value;
        return result.ToInt();
    }

    public static int ToInt(this float value)
        => (int)value;

    public static async Task<int> ToInt(this Task<float> value)
    {
        var result = await value;
        return result.ToInt();
    }
}