namespace OJS.Services.Administration.Models.ExamGroups;

public class UserInExamGroupCreateDeleteValidationServiceModel
{
    public int? ContestId { get; set; }

    public bool IsCreate { get; set; }
}