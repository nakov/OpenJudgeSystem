USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[AspNetRoles]'))
    SET IDENTITY_INSERT [dbo].[AspNetRoles] ON;
GO

INSERT INTO [dbo].[AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp])
VALUES (N'1', N'Administrator', N'ADMINISTRATOR', NULL)
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[AspNetRoles]'))
    SET IDENTITY_INSERT [dbo].[AspNetRoles] OFF;
GO