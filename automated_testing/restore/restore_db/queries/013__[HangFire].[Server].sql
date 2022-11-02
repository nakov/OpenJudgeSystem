USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] ON;
GO

INSERT INTO [HangFire].[Server] ([Id], [Data], [LastHeartbeat])
VALUES (N'7ff4fea6629f:8:eacb9fa0-a8a5-4c78-98df-9381fecdf242', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-11-02T11:02:57.2859918Z"}', CAST(N'2022-11-02T11:03:27+00:00' AS DateTime2)),
(N'88bb6d84479e:7:6b2d5fdd-1f7a-4262-ad76-659b5cb5c4c3', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-11-02T11:02:57.9566177Z"}', CAST(N'2022-11-02T11:03:28+00:00' AS DateTime2))
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] OFF;
GO