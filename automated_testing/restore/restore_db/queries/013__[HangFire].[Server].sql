USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] ON;
GO

INSERT INTO [HangFire].[Server] ([Id], [Data], [LastHeartbeat])
VALUES (N'3a972eabeb0a:8:9b725733-6a35-4f6e-9b68-bd28d5ceb813', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-09-12T14:28:49.7408859Z"}', CAST(N'2022-09-12T14:29:49+00:00' AS DateTime2)),
(N'9718b7db2f41:7:ac1576c2-c254-437e-86a2-a2c89e6f1ef7', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-09-12T14:28:29.7498905Z"}', CAST(N'2022-09-12T14:29:59+00:00' AS DateTime2))
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] OFF;
GO