USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[Contests]'))
    SET IDENTITY_INSERT [dbo].[Contests] ON;
GO

INSERT INTO [dbo].[Contests] ([Id], [Name], [IsVisible], [AutoChangeTestsFeedbackVisibility], [CategoryId], [Type], [Duration], [StartTime], [EndTime], [ContestPassword], [PracticePassword], [NewIpPassword], [PracticeStartTime], [PracticeEndTime], [LimitBetweenSubmissions], [OrderBy], [NumberOfProblemGroups], [Description], [CreatedOn], [ModifiedOn], [IsDeleted], [DeletedOn])
VALUES (1, N'Compete test contest', 1, 0, 1, 1, NULL, CAST(N'2024-09-12T10:00:00+00:00' AS DateTime2), CAST(N'2024-12-12T23:00:00+00:00' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 60, 10, 0, N'test', CAST(N'2022-07-04T00:00:00+00:00' AS DateTime2), CAST(N'2022-09-20T09:09:12+00:00' AS DateTime2), 0, NULL),
(2, N'Past Test Contest', 1, 0, 1, 0, NULL, CAST(N'2024-09-04T12:00:00+00:00' AS DateTime2), CAST(N'2022-09-05T12:00:00+00:00' AS DateTime2), NULL, NULL, NULL, CAST(N'2022-09-11T12:00:00+00:00' AS DateTime2), CAST(N'2022-09-30T12:00:00+00:00' AS DateTime2), 0, 10, 0, NULL, CAST(N'2022-09-12T10:59:58+00:00' AS DateTime2), CAST(N'2022-09-27T11:21:49+00:00' AS DateTime2), 0, NULL),
(3, N'Active contest for password tests', 1, 0, 1, 0, NULL, CAST(N'2022-09-12T12:00:00+00:00' AS DateTime2), CAST(N'2024-09-14T12:00:00+00:00' AS DateTime2), N'test', N'test', NULL, NULL, NULL, 0, 0, 0, NULL, CAST(N'2022-09-12T14:29:43+00:00' AS DateTime2), CAST(N'2022-09-13T10:23:08+00:00' AS DateTime2), 0, NULL),
(4, N'Compete contest password checker', 1, 0, 2, 1, NULL, CAST(N'2022-09-19T12:00:00+00:00' AS DateTime2), CAST(N'2024-09-21T12:00:00+00:00' AS DateTime2), N'test', NULL, NULL, NULL, NULL, 0, 0, 0, NULL, CAST(N'2022-09-19T19:56:19+00:00' AS DateTime2), CAST(N'2022-09-20T09:10:44+00:00' AS DateTime2), 0, NULL)
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[Contests]'))
    SET IDENTITY_INSERT [dbo].[Contests] OFF;
GO