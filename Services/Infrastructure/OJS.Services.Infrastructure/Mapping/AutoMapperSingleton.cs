namespace OJS.Services.Infrastructure.Mapping
{
    using AutoMapper;

    public class AutoMapperSingleton
    {
        private AutoMapperSingleton(IMapper mapper)
            => this.Mapper = mapper;

        public IMapper Mapper { get; }

        public static AutoMapperSingleton Instance { get; private set; }

        public static void Init(IMapper mapper)
            => Instance = new AutoMapperSingleton(mapper);
    }
}