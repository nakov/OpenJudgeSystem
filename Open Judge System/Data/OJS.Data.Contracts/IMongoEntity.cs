namespace OJS.Data.Contracts
{
    public interface IMongoEntity<TIdentifier>
    {
        TIdentifier Id { get; set; }
    }
}
