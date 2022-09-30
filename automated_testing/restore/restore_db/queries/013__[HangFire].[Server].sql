USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] ON;
GO

INSERT INTO [HangFire].[Server] ([Id], [Data], [LastHeartbeat])
VALUES (N'81f05525987b:8:d6c9a083-d787-4a71-8e5a-3a9c3d37e837', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-09-28T14:40:46.6712883Z"}', CAST(N'2022-09-28T14:40:46+00:00' AS DateTime2)),
(N'ebe504589a49:7:08e5cd44-e02d-41c2-a7e7-d1af64be655f', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-09-28T14:40:46.4761015Z"}', CAST(N'2022-09-28T14:40:46+00:00' AS DateTime2))
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] OFF;
GO