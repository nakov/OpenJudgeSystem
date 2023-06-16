namespace OJS.Data.Validation.Attributes;
using System;

/// <summary>
/// This attribute is used to mark DateTime properties that are meant to be interpreted in Local time zone and upon
/// storing in the database will be converted to UTC and vice versa - from UTC will be converted to Local time when
/// requested via EF.
/// </summary>
[AttributeUsage(AttributeTargets.Property)]
public class UtcConvertableAttribute : Attribute
{
}