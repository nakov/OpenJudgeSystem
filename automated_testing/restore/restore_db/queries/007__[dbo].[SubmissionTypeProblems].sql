USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[SubmissionTypeProblems]'))
    SET IDENTITY_INSERT [dbo].[SubmissionTypeProblems] ON;
GO

INSERT INTO [dbo].[SubmissionTypeProblems] ([SubmissionTypeId], [ProblemId])
VALUES (1, 1),
(11, 1),
(3, 2),
(4, 2),
(3, 3)
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[SubmissionTypeProblems]'))
    SET IDENTITY_INSERT [dbo].[SubmissionTypeProblems] OFF;
GO