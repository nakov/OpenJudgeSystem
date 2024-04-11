namespace OJS.Services.Ui.Models.Contests;

public enum ContestSortType
{
    StartDate = 0,
    EndDate = 1,
    Name = 2,
    OrderBy = 3,
    // Participated contests by user are ordered by participation time descending
    ParticipantRegistrationTime = 4,
}

public enum ContestSortTypeDirection
{
    Ascending = 0,
    Descending = 1,
}