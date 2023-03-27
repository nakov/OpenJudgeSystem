namespace OJS.Data.Infrastructure;

using System;
using System.Collections;
using System.Data;
using System.Data.Common;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

public class DelegatingDbDataReader : DbDataReader
{
    private readonly DbDataReader source;

    public DelegatingDbDataReader(DbDataReader source) => this.source = source;

    public override int VisibleFieldCount => this.source.VisibleFieldCount;

    public override int Depth => this.source.Depth;

    public override int FieldCount => this.source.FieldCount;

    public override bool HasRows => this.source.HasRows;

    public override bool IsClosed => this.source.IsClosed;

    public override int RecordsAffected => this.source.RecordsAffected;

    public override object this[string name] => this.source[name];

    public override object this[int ordinal] => this.source[ordinal];

    public override bool GetBoolean(int ordinal) => this.source.GetBoolean(ordinal);

    public override byte GetByte(int ordinal) => this.source.GetByte(ordinal);

    public override long GetBytes(int ordinal, long dataOffset, byte[]? buffer, int bufferOffset, int length) =>
        this.source.GetBytes(ordinal, dataOffset, buffer, bufferOffset, length);

    public override char GetChar(int ordinal) => this.source.GetChar(ordinal);

    public override long GetChars(int ordinal, long dataOffset, char[]? buffer, int bufferOffset, int length) =>
        this.source.GetChars(ordinal, dataOffset, buffer, bufferOffset, length);

    public override string GetDataTypeName(int ordinal) => this.source.GetDataTypeName(ordinal);

    public override DateTime GetDateTime(int ordinal) => DateTime.SpecifyKind(this.source.GetDateTime(ordinal), DateTimeKind.Utc);

    public override decimal GetDecimal(int ordinal) => this.source.GetDecimal(ordinal);

    public override double GetDouble(int ordinal) => this.source.GetDouble(ordinal);

    public override IEnumerator GetEnumerator() => this.source.GetEnumerator();

    public override Type GetFieldType(int ordinal) => this.source.GetFieldType(ordinal);

    public override float GetFloat(int ordinal) => this.source.GetFloat(ordinal);

    public override Guid GetGuid(int ordinal) => this.source.GetGuid(ordinal);

    public override short GetInt16(int ordinal) => this.source.GetInt16(ordinal);

    public override int GetInt32(int ordinal) => this.source.GetInt32(ordinal);

    public override long GetInt64(int ordinal) => this.source.GetInt64(ordinal);

    public override string GetName(int ordinal) => this.source.GetName(ordinal);

    public override int GetOrdinal(string name) => this.source.GetOrdinal(name);

    public override string GetString(int ordinal) => this.source.GetString(ordinal);

    public override object GetValue(int ordinal) => this.source.GetValue(ordinal);

    public override int GetValues(object[] values) => this.source.GetValues(values);

    public override bool IsDBNull(int ordinal) => this.source.IsDBNull(ordinal);

    public override bool NextResult() => this.source.NextResult();

    public override bool Read() => this.source.Read();

    public override void Close() => this.source.Close();

    public override T GetFieldValue<T>(int ordinal) => this.source.GetFieldValue<T>(ordinal);

    public override Task<T> GetFieldValueAsync<T>(int ordinal, CancellationToken cancellationToken) =>
        this.source.GetFieldValueAsync<T>(ordinal, cancellationToken);

    public override Type GetProviderSpecificFieldType(int ordinal) => this.source.GetProviderSpecificFieldType(ordinal);

    public override object GetProviderSpecificValue(int ordinal) => this.source.GetProviderSpecificValue(ordinal);

    public override int GetProviderSpecificValues(object[] values) => this.source.GetProviderSpecificValues(values);

    public override DataTable GetSchemaTable() => this.source.GetSchemaTable() !;

    public override Stream GetStream(int ordinal) => this.source.GetStream(ordinal);

    public override TextReader GetTextReader(int ordinal) => this.source.GetTextReader(ordinal);

    public override Task<bool> IsDBNullAsync(int ordinal, CancellationToken cancellationToken) =>
        this.source.IsDBNullAsync(ordinal, cancellationToken);

    public override Task<bool> ReadAsync(CancellationToken cancellationToken) =>
        this.source.ReadAsync(cancellationToken);
}