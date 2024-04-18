namespace OJS.Data.Infrastructure.Models
{
    public interface IOrderableEntity : IEntity
    {
        public double OrderBy { get; set; }
    }
}