namespace OJS.Services.Infrastructure.Implementations
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;

    public class RandomProvider : IRandomProvider
    {
        private const string ValidLetters = "qwertyuiopasdfghjklzxcvbnm_1234567890";
        private const int RandomStringDefaultLength = 16;

        private static readonly Random RandomInstance = new Random();

        public int GetRandomRightPaddedNumber(int maxValue, int length, char paddingCharacter)
            => int.Parse($"{RandomInstance.Next(1, maxValue)}".PadRight(length, paddingCharacter), null);

        public int GetRandomInteger(int length)
        {
            var min = (int)Math.Pow(10, length - 1);
            var max = (int)Math.Pow(10, length) - 1;
            return RandomInstance.Next(min, max);
        }

        public int GetRandomIntegerFromTo(int fromValue, int toValue)
            => RandomInstance.Next(fromValue, toValue);

        public T GetRandomElement<T>(IEnumerable<T> collection)
            => collection.ElementAt(this.GetRandomIntegerFromTo(0, collection.Count() - 1));

        public string GetRandomString()
            => this.GetRandomString(RandomStringDefaultLength);

        public string GetRandomString(int length)
            => string.Join(string.Empty, GetRandomChars(length));

        private static char GetRandomChar()
            => ValidLetters[RandomInstance.Next(ValidLetters.Length)];

        private static IEnumerable<char> GetRandomChars(int length)
            => Enumerable.Range(0, length).Select(_ => GetRandomChar());
    }
}