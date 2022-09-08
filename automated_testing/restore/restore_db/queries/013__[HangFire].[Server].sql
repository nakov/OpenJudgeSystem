USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] ON;
GO

INSERT INTO [HangFire].[Server] ([Id], [Data], [LastHeartbeat])
VALUES (N'10076f7564c6:7:4c986c23-92f2-471e-9d4a-74ab678c0aec', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-09-08T08:14:13.8579465Z"}', CAST(N'2022-09-08T08:14:13+00:00' AS DateTime2)),
(N'b5a6d517df93:7:17cd5027-bc3a-4bd1-9258-270fce995f1e', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-09-08T08:14:13.5578251Z"}', CAST(N'2022-09-08T08:14:13+00:00' AS DateTime2))
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] OFF;
GO