USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[Contests]'))
    SET IDENTITY_INSERT [dbo].[Contests] ON;
GO

INSERT INTO [dbo].[Contests] ([Id], [Name], [IsVisible], [AutoChangeTestsFeedbackVisibility], [CategoryId], [Type], [Duration], [StartTime], [EndTime], [ContestPassword], [PracticePassword], [NewIpPassword], [PracticeStartTime], [PracticeEndTime], [LimitBetweenSubmissions], [OrderBy], [NumberOfProblemGroups], [Description], [CreatedOn], [ModifiedOn], [IsDeleted], [DeletedOn])
VALUES (1, N'Compete test contest', 1, 0, 1, 1, NULL, CAST(N'2022-09-12T10:00:00+00:00' AS DateTime2), CAST(N'2024-12-12T23:00:00+00:00' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 60, 10, 0, N'test', CAST(N'2022-07-04T00:00:00+00:00' AS DateTime2), CAST(N'2022-09-12T10:35:18+00:00' AS DateTime2), 0, NULL),
(2, N'Past Test Contest', 1, 0, 1, 0, NULL, CAST(N'2022-09-04T12:00:00+00:00' AS DateTime2), CAST(N'2022-09-05T12:00:00+00:00' AS DateTime2), NULL, NULL, NULL, CAST(N'2022-09-11T12:00:00+00:00' AS DateTime2), CAST(N'2022-09-30T12:00:00+00:00' AS DateTime2), 0, 10, 0, NULL, CAST(N'2022-09-12T10:59:58+00:00' AS DateTime2), NULL, 0, NULL),
(3, N'Test active contest', 1, 0, 1, 0, NULL, CAST(N'2022-09-12T12:00:00+00:00' AS DateTime2), CAST(N'2022-09-14T12:00:00+00:00' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, CAST(N'2022-09-12T14:29:43+00:00' AS DateTime2), NULL, 0, NULL)
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[Contests]'))
    SET IDENTITY_INSERT [dbo].[Contests] OFF;
GO