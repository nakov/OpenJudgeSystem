USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[AspNetUserRoles]'))
    SET IDENTITY_INSERT [dbo].[AspNetUserRoles] ON;
GO

INSERT INTO [dbo].[AspNetUserRoles] ([UserId], [RoleId])
VALUES (N'f88a0975-a888-4bac-84f0-bea59472804a', N'1')
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[AspNetUserRoles]'))
    SET IDENTITY_INSERT [dbo].[AspNetUserRoles] OFF;
GO