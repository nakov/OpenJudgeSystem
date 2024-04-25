namespace OJS.Data.Models.Common
{
    public interface IOrderableEntity : IEntity
    {
        public double OrderBy { get; set; }
    }
}