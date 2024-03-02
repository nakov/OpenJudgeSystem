namespace OJS.Servers.Administration.JsonConverters;

using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

public class JsonDateTimeConverter : JsonConverter<DateTime>
{
    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => reader.GetDateTime();

    // Write the datetime in UTC ISO string format.
    public override void Write(Utf8JsonWriter writer, DateTime dateTime, JsonSerializerOptions options)
    {
        var isoFormattedDate = DateTime.SpecifyKind(dateTime, DateTimeKind.Utc)
            .ToString("o", CultureInfo.InvariantCulture);

        // Append "Z" to indicate that the Date is in UTC.
        writer.WriteStringValue(isoFormattedDate.EndsWith("Z")
            ? isoFormattedDate
            : isoFormattedDate + "Z");
    }
}