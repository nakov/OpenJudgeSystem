namespace OJS.Data.Contracts
{
    public interface IEntity<TIdentifier>
    {
        TIdentifier Id { get; set; }
    }
}
