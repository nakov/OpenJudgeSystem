/* AspNetRoles */
INSERT INTO OpenJudgeSystem.dbo.AspNetRoles (
       Id, Name, NormalizedName, ConcurrencyStamp)
SELECT Id, Name, UPPER(Name), NULL
FROM OnlineJudgeSystem.dbo.AspNetRoles

/* AspNetUsers */
INSERT INTO OpenJudgeSystem.dbo.AspNetUsers (
       Id, Email, FirstName, LastName, City, EducationalInstitution, FacultyNumber, DateOfBirth, Company, JobTitle, IsDeleted, DeletedOn, CreatedOn, ModifiedOn, UserName, EmailConfirmed, PasswordHash, SecurityStamp, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount, LockoutEnd, NormalizedUserName, NormalizedEmail, ConcurrencyStamp)
SELECT Id, Email, FirstName, LastName, City, EducationalInstitution, FacultyNumber, DateOfBirth, Company, JobTitle, IsDeleted, DeletedOn, CreatedOn, ModifiedOn, UserName, EmailConfirmed, PasswordHash, SecurityStamp, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount, LockoutEndDateUtc, UPPER(UserName), NULL, NULL
FROM OnlineJudgeSystem.dbo.AspNetUsers

/* AspNetUserRoles */
INSERT INTO OpenJudgeSystem.dbo.AspNetUserRoles (
       UserId, RoleId)
SELECT UserId, RoleId
FROM OnlineJudgeSystem.dbo.AspNetUserRoles

/* Checkers */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.Checkers ON
INSERT INTO OpenJudgeSystem.dbo.Checkers (
       Id, Name, Description, DllFile, ClassName, Parameter, IsDeleted, DeletedOn, CreatedOn, ModifiedOn)
SELECT Id, Name, Description, DllFile, ClassName, Parameter, IsDeleted, DeletedOn, CreatedOn, ModifiedOn
FROM OnlineJudgeSystem.dbo.Checkers
SET IDENTITY_INSERT OpenJudgeSystem.dbo.Checkers OFF
END

/* ContestCategories */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.ContestCategories ON
INSERT INTO OpenJudgeSystem.dbo.ContestCategories (
       Id, Name, OrderBy, ParentId, IsVisible, IsDeleted, DeletedOn, CreatedOn, ModifiedOn)
SELECT Id, Name, OrderBy, ParentId, IsVisible, IsDeleted, DeletedOn, CreatedOn, ModifiedOn
FROM OnlineJudgeSystem.dbo.ContestCategories
SET IDENTITY_INSERT OpenJudgeSystem.dbo.ContestCategories OFF
END

/* Contests */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.Contests ON
INSERT INTO OpenJudgeSystem.dbo.Contests (
       Id, Name, IsVisible, AutoChangeTestsFeedbackVisibility, CategoryId, Type, Duration, StartTime, EndTime, ContestPassword, PracticePassword, NewIpPassword, PracticeStartTime, PracticeEndTime, LimitBetweenSubmissions, OrderBy, NumberOfProblemGroups, Description, CreatedOn, ModifiedOn, IsDeleted, DeletedOn)
SELECT Id, Name, IsVisible, AutoChangeTestsFeedbackVisibility, CategoryId, Type, Duration, StartTime, EndTime, ContestPassword, PracticePassword, NewIpPassword, PracticeStartTime, PracticeEndTime, LimitBetweenSubmissions, OrderBy, NumberOfProblemGroups, Description, CreatedOn, ModifiedOn, IsDeleted, DeletedOn
FROM OnlineJudgeSystem.dbo.Contests
SET IDENTITY_INSERT OpenJudgeSystem.dbo.Contests OFF
END

/* ContestQuestions */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.ContestQuestions ON
INSERT INTO OpenJudgeSystem.dbo.ContestQuestions (
       Id, ContestId, Text, AskOfficialParticipants, AskPracticeParticipants, Type, RegularExpressionValidation, CreatedOn, ModifiedOn, IsDeleted, DeletedOn)
SELECT Id, ContestId, Text, AskOfficialParticipants, AskPracticeParticipants, Type, RegularExpressionValidation, CreatedOn, ModifiedOn, IsDeleted, DeletedOn
FROM OnlineJudgeSystem.dbo.ContestQuestions
SET IDENTITY_INSERT OpenJudgeSystem.dbo.ContestQuestions OFF
END

/* ContestQuestionAnswers */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.ContestQuestionAnswers ON
INSERT INTO OpenJudgeSystem.dbo.ContestQuestionAnswers (
       Id, QuestionId, Text, CreatedOn, ModifiedOn, IsDeleted, DeletedOn)
SELECT Id, QuestionId, Text, CreatedOn, ModifiedOn, IsDeleted, DeletedOn
FROM OnlineJudgeSystem.dbo.ContestQuestionAnswers
SET IDENTITY_INSERT OpenJudgeSystem.dbo.ContestQuestionAnswers OFF
END

/* Ips */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.Ips ON
INSERT INTO OpenJudgeSystem.dbo.Ips (
       Id, Value, Description, CreatedOn, ModifiedOn)
SELECT Id, Value, Description, CreatedOn, ModifiedOn
FROM OnlineJudgeSystem.dbo.Ips
SET IDENTITY_INSERT OpenJudgeSystem.dbo.Ips OFF
END

/* ContestIps */
INSERT INTO OpenJudgeSystem.dbo.ContestIps (
       ContestId, IpId, IsOriginallyAllowed)
SELECT ContestId, IpId, IsOriginallyAllowed
FROM OnlineJudgeSystem.dbo.ContestIps

/* ExamGroups */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.ExamGroups ON
INSERT INTO OpenJudgeSystem.dbo.ExamGroups (
       Id, ExternalExamGroupId, ExternalAppId, Name, ContestId)
SELECT Id, ExternalExamGroupId, ExternalAppId, Name, ContestId
FROM OnlineJudgeSystem.dbo.ExamGroups
SET IDENTITY_INSERT OpenJudgeSystem.dbo.ExamGroups OFF
END

/* FeedbackReports */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.FeedbackReports ON
INSERT INTO OpenJudgeSystem.dbo.FeedbackReports (
       Id, Name, Email, Content, UserId, IsFixed, CreatedOn, ModifiedOn, IsDeleted, DeletedOn)
SELECT Id, Name, Email, Content, UserId, IsFixed, CreatedOn, ModifiedOn, IsDeleted, DeletedOn
FROM OnlineJudgeSystem.dbo.FeedbackReports
SET IDENTITY_INSERT OpenJudgeSystem.dbo.FeedbackReports OFF
END

/* LecturersInContestCategories */
INSERT INTO OpenJudgeSystem.dbo.LecturersInContestCategories (
       LecturerId, ContestCategoryId, CreatedOn, ModifiedOn)
SELECT LecturerId, ContestCategoryId, CreatedOn, ModifiedOn
FROM OnlineJudgeSystem.dbo.LecturerInContestCategories

/* LecturersInContests */
INSERT INTO OpenJudgeSystem.dbo.LecturersInContests (
       LecturerId, ContestId, CreatedOn, ModifiedOn)
SELECT LecturerId, ContestId, CreatedOn, ModifiedOn
FROM OnlineJudgeSystem.dbo.LecturerInContests

/* Participants */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.Participants ON
INSERT INTO OpenJudgeSystem.dbo.Participants (
       Id, ContestId, UserId, ParticipationStartTime, ParticipationEndTime, IsOfficial, IsInvalidated, CreatedOn, ModifiedOn)
SELECT Id, ContestId, UserId, ParticipationStartTime, ParticipationEndTime, IsOfficial, IsInvalidated, CreatedOn, ModifiedOn
FROM OnlineJudgeSystem.dbo.Participants
SET IDENTITY_INSERT OpenJudgeSystem.dbo.Participants OFF
END

/* ParticipantAnswers */
INSERT INTO OpenJudgeSystem.dbo.ParticipantAnswers (
       ParticipantId, ContestQuestionId, Answer)
SELECT ParticipantId, ContestQuestionId, Answer
FROM OnlineJudgeSystem.dbo.ParticipantAnswers

/* ProblemGroups */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.ProblemGroups ON
INSERT INTO OpenJudgeSystem.dbo.ProblemGroups (
       Id, ContestId, OrderBy, Type, CreatedOn, ModifiedOn, IsDeleted, DeletedOn)
SELECT Id, ContestId, OrderBy, Type, CreatedOn, ModifiedOn, IsDeleted, DeletedOn
FROM OnlineJudgeSystem.dbo.ProblemGroups
SET IDENTITY_INSERT OpenJudgeSystem.dbo.ProblemGroups OFF
END

/* Problems */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.Problems ON
INSERT INTO OpenJudgeSystem.dbo.Problems (
       Id, ProblemGroupId, Name, MaximumPoints, TimeLimit, MemoryLimit, SourceCodeSizeLimit, CheckerId, OrderBy, SolutionSkeleton, AdditionalFiles, ShowResults, ShowDetailedFeedback, CreatedOn, ModifiedOn, IsDeleted, DeletedOn)
SELECT Id, ProblemGroupId, Name, MaximumPoints, TimeLimit, MemoryLimit, SourceCodeSizeLimit, CheckerId, OrderBy, SolutionSkeleton, AdditionalFiles, ShowResults, ShowDetailedFeedback, CreatedOn, ModifiedOn, IsDeleted, DeletedOn
FROM OnlineJudgeSystem.dbo.Problems
SET IDENTITY_INSERT OpenJudgeSystem.dbo.Problems OFF
END

/* ProblemsForParticipants */
INSERT INTO OpenJudgeSystem.dbo.ProblemsForParticipants (
       ProblemId, ParticipantId)
SELECT Problem_Id, Participant_Id
FROM OnlineJudgeSystem.dbo.ProblemsForParticipants

/* SubmissionTypes */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.SubmissionTypes ON
INSERT INTO OpenJudgeSystem.dbo.SubmissionTypes (
       Id, Name, IsSelectedByDefault, ExecutionStrategyType, CompilerType, AdditionalCompilerArguments, Description, AllowBinaryFilesUpload, AllowedFileExtensions)
SELECT Id, Name, IsSelectedByDefault, ExecutionStrategyType, CompilerType, AdditionalCompilerArguments, Description, AllowBinaryFilesUpload, AllowedFileExtensions
FROM OnlineJudgeSystem.dbo.SubmissionTypes
SET IDENTITY_INSERT OpenJudgeSystem.dbo.SubmissionTypes OFF
END

/* SubmissionTypeProblems */
INSERT INTO OpenJudgeSystem.dbo.SubmissionTypeProblems (
       SubmissionTypeId, ProblemId)
SELECT SubmissionType_Id, Problem_Id
FROM OnlineJudgeSystem.dbo.SubmissionTypeProblems

/* Tests */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.Tests ON
INSERT INTO OpenJudgeSystem.dbo.Tests (
       Id, ProblemId, InputData, OutputData, IsTrialTest, IsOpenTest, HideInput, OrderBy)
SELECT Id, ProblemId, InputData, OutputData, IsTrialTest, IsOpenTest, HideInput, OrderBy
FROM OnlineJudgeSystem.dbo.Tests
SET IDENTITY_INSERT OpenJudgeSystem.dbo.Tests OFF
END

/* UsersInExamGroups */
INSERT INTO OpenJudgeSystem.dbo.UsersInExamGroups (
       UserId, ExamGroupId)
SELECT UserId, ExamGroupId
FROM OnlineJudgeSystem.dbo.UsersInExamGroups

/* Submissions */
BEGIN
DECLARE @now_date datetime2 = GETDATE();
SET IDENTITY_INSERT OpenJudgeSystem.dbo.Submissions ON
INSERT INTO OpenJudgeSystem.dbo.Submissions (
       Id, ParticipantId, ProblemId, SubmissionTypeId, Content, FileExtension, SolutionSkeleton, IpAddress, IsCompiledSuccessfully, CompilerComment, IsPublic, TestRunsCache, Processed, ProcessingComment, Points, CreatedOn, ModifiedOn, IsDeleted, DeletedOn)
SELECT S.Id, S.ParticipantId, S.ProblemId, SubmissionTypeId, Content, FileExtension, SolutionSkeleton, IpAddress, IsCompiledSuccessfully, CompilerComment, IsPublic, TestRunsCache, Processed, ProcessingComment, S.Points, CreatedOn, ModifiedOn, IsDeleted, DeletedOn
FROM OnlineJudgeSystem.dbo.Submissions S
LEFT JOIN OnlineJudgeSystem.dbo.ParticipantScores PS on S.Id = PS.SubmissionId
WHERE S.CreatedOn > DATEADD(year, -1, @now_date) OR (S.CreatedOn > DATEADD(year, -2, @now_date) AND PS.SubmissionId = S.Id)
SET IDENTITY_INSERT OpenJudgeSystem.dbo.Submissions OFF
END

/* TestRuns */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.TestRuns ON
INSERT INTO OpenJudgeSystem.dbo.TestRuns (
       Id, SubmissionId, TestId, TimeUsed, MemoryUsed, ResultType, ExecutionComment, CheckerComment, ExpectedOutputFragment, UserOutputFragment)
SELECT TR.Id, SubmissionId, TestId, TimeUsed, MemoryUsed, ResultType, ExecutionComment, CheckerComment, ExpectedOutputFragment, UserOutputFragment
FROM OnlineJudgeSystem.dbo.TestRuns TR
INNER JOIN OpenJudgeSystem.dbo.Submissions S on S.Id = TR.SubmissionId
SET IDENTITY_INSERT OpenJudgeSystem.dbo.TestRuns OFF
END

/* ParticipantScores */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.ParticipantScores ON
INSERT INTO OpenJudgeSystem.dbo.ParticipantScores (
       Id, ProblemId, ParticipantId, SubmissionId, ParticipantName, Points, IsOfficial)
SELECT PS.Id, PS.ProblemId, PS.ParticipantId, S.Id, PS.ParticipantName, PS.Points, PS.IsOfficial
FROM OnlineJudgeSystem.dbo.ParticipantScores PS
LEFT JOIN OpenJudgeSystem.dbo.Submissions S ON S.Id = PS.SubmissionId
SET IDENTITY_INSERT OpenJudgeSystem.dbo.ParticipantScores OFF
END

/* ProblemResources */
BEGIN
SET IDENTITY_INSERT OpenJudgeSystem.dbo.ProblemResources ON
INSERT INTO OpenJudgeSystem.dbo.ProblemResources (
       Id, ProblemId, Name, Type, [File], FileExtension, Link, OrderBy, CreatedOn, ModifiedOn, IsDeleted, DeletedOn)
SELECT Id, ProblemId, Name, Type, [File], FileExtension, Link, OrderBy, CreatedOn, ModifiedOn, IsDeleted, DeletedOn
FROM OnlineJudgeSystem.dbo.ProblemResources
WHERE IsDeleted = 0
SET IDENTITY_INSERT OpenJudgeSystem.dbo.ProblemResources OFF
END

