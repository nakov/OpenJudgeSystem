USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[Participants]'))
    SET IDENTITY_INSERT [dbo].[Participants] ON;
GO

INSERT INTO [dbo].[Participants] ([Id], [ContestId], [UserId], [ParticipationStartTime], [ParticipationEndTime], [IsOfficial], [IsInvalidated], [CreatedOn], [ModifiedOn])
VALUES (1, 1, N'f88a0975-a888-4bac-84f0-bea59472804a', NULL, NULL, 1, 1, CAST(N'2022-09-05T10:25:37+00:00' AS DateTime2), NULL),
(2, 4, N'f88a0975-a888-4bac-84f0-bea59472804a', NULL, NULL, 1, 0, CAST(N'2022-09-19T19:58:55+00:00' AS DateTime2), NULL),
(3, 2, N'f88a0975-a888-4bac-84f0-bea59472804a', NULL, NULL, 0, 0, CAST(N'2022-09-20T09:08:38+00:00' AS DateTime2), NULL)
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[Participants]'))
    SET IDENTITY_INSERT [dbo].[Participants] OFF;
GO