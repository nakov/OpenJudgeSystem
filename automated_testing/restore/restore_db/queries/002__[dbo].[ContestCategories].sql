USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[ContestCategories]'))
    SET IDENTITY_INSERT [dbo].[ContestCategories] ON;
GO

INSERT INTO [dbo].[ContestCategories] ([Id], [Name], [OrderBy], [ParentId], [IsVisible], [CreatedOn], [ModifiedOn], [IsDeleted], [DeletedOn])
VALUES (1, N'Test Category', 0, NULL, 1, CAST(N'2022-07-05T10:45:54+00:00' AS DateTime2), NULL, 0, NULL),
(2, N'Programming Basics', 10, 1, 1, CAST(N'2022-09-20T09:10:04+00:00' AS DateTime2), NULL, 0, NULL)
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[ContestCategories]'))
    SET IDENTITY_INSERT [dbo].[ContestCategories] OFF;
GO