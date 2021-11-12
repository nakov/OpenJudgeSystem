namespace OJS.Services.Infrastructure.Mapping
{
    using AutoMapper;

    public class AutoMapperSingleton
    {
        private AutoMapperSingleton(Mapper mapper)
            => this.Mapper = mapper;

        public Mapper Mapper { get; }

        public static AutoMapperSingleton Instance { get; private set; }

        public static void Init(Mapper mapper)
            => Instance = new AutoMapperSingleton(mapper);
    }
}