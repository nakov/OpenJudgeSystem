﻿namespace OJS.Services.Ui.Models.Contests;

public class ValidationModel
{
    public bool ContestIsFound { get; set; } = true;

    public bool ContestCanBeCompeted { get; set; } = true;

    public bool ContestCanBePracticed { get; set; } = true;

    public bool ContestIsNotExpired { get; set; } = true;

    public bool IsParticipantRegistered { get; set; } = true;
}