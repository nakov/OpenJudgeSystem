USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[Tests]'))
    SET IDENTITY_INSERT [dbo].[Tests] ON;
GO

INSERT INTO [dbo].[Tests] ([Id], [ProblemId], [InputData], [OutputData], [IsTrialTest], [IsOpenTest], [HideInput], [OrderBy])
VALUES (1, 1, 0X33E4E5320200, 0X330600, 1, 0, 0, 0),
(2, 1, 0X33E4E532E2E50200, 0X330600, 0, 0, 0, 0),
(3, 2, 0X3334320600, 0X3334320600, 1, 0, 0, 0)
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[Tests]'))
    SET IDENTITY_INSERT [dbo].[Tests] OFF;
GO