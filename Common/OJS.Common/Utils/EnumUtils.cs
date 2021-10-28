namespace OJS.Common.Utils
{
    using System;

    public static class EnumUtils
    {
        public static TEnum[] GetValuesFrom<TEnum>()
            where TEnum : Enum
            => (TEnum[])Enum.GetValues(typeof(TEnum));
    }
}