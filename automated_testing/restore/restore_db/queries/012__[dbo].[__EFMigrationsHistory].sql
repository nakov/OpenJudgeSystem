USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[__EFMigrationsHistory]'))
    SET IDENTITY_INSERT [dbo].[__EFMigrationsHistory] ON;
GO

INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20220325170939_InitialMigration', N'6.0.0')
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[__EFMigrationsHistory]'))
    SET IDENTITY_INSERT [dbo].[__EFMigrationsHistory] OFF;
GO