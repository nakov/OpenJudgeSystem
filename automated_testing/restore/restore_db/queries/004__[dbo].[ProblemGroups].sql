USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[ProblemGroups]'))
    SET IDENTITY_INSERT [dbo].[ProblemGroups] ON;
GO

INSERT INTO [dbo].[ProblemGroups] ([Id], [ContestId], [OrderBy], [Type], [CreatedOn], [ModifiedOn], [IsDeleted], [DeletedOn])
VALUES (1, 1, 0, NULL, CAST(N'2022-09-05T10:25:16+00:00' AS DateTime2), NULL, 0, NULL),
(2, 4, 10, NULL, CAST(N'2022-09-19T19:58:21+00:00' AS DateTime2), NULL, 0, NULL)
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[ProblemGroups]'))
    SET IDENTITY_INSERT [dbo].[ProblemGroups] OFF;
GO