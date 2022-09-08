USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[Problems]'))
    SET IDENTITY_INSERT [dbo].[Problems] ON;
GO

INSERT INTO [dbo].[Problems] ([Id], [ProblemGroupId], [Name], [MaximumPoints], [TimeLimit], [MemoryLimit], [SourceCodeSizeLimit], [CheckerId], [OrderBy], [SolutionSkeleton], [AdditionalFiles], [ShowResults], [ShowDetailedFeedback], [CreatedOn], [ModifiedOn], [IsDeleted], [DeletedOn])
VALUES (1, 1, N'First problem ever', 100, 100, 4096, 1000, NULL, 0, NULL, NULL, 0, 0, CAST(N'2022-09-05T10:25:16+00:00' AS DateTime2), NULL, 0, NULL)
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[Problems]'))
    SET IDENTITY_INSERT [dbo].[Problems] OFF;
GO