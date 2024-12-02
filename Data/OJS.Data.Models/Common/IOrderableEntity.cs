namespace OJS.Data.Models.Common
{
    public interface IOrderableEntity : IEntity
    {
        double OrderBy { get; set; }
    }
}