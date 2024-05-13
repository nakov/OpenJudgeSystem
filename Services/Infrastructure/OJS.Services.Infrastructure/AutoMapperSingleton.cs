namespace OJS.Services.Infrastructure;

using AutoMapper;

public class AutoMapperSingleton
{
    private AutoMapperSingleton(IMapper mapper)
        => this.Mapper = mapper;

    public static AutoMapperSingleton Instance { get; private set; } = new(null!);

    public IMapper Mapper { get; }

    public static void Init(IMapper mapper)
        => Instance = new AutoMapperSingleton(mapper);
}