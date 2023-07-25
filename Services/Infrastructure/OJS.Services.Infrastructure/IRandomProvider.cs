namespace OJS.Services.Infrastructure
{
    using System.Collections.Generic;
    using SoftUni.Services.Infrastructure;

    public interface IRandomProvider : IService
    {
        int GetRandomRightPaddedNumber(int maxValue, int length, char paddingCharacter);

        string GetRandomString();

        string GetRandomString(int length);

        int GetRandomInteger(int length);

        int GetRandomIntegerFromTo(int from, int to);

        T GetRandomElement<T>(IEnumerable<T> collection);
    }
}
