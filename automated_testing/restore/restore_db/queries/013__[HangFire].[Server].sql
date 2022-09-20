USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] ON;
GO

INSERT INTO [HangFire].[Server] ([Id], [Data], [LastHeartbeat])
VALUES (N'0fee827af580:7:cc3dee4e-f544-4556-bfa5-28f8279b5827', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-09-20T20:48:22.0334473Z"}', CAST(N'2022-09-20T20:50:52+00:00' AS DateTime2)),
(N'3fcb2ca7b147:7:6597fe37-150d-40c8-a381-ff2574dfd815', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-09-20T20:48:11.2163688Z"}', CAST(N'2022-09-20T20:48:11+00:00' AS DateTime2)),
(N'd3b6f3917bbe:7:112c36ce-7e03-486c-8ace-ffe4b06b2387', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-09-20T20:48:11.0471376Z"}', CAST(N'2022-09-20T20:50:41+00:00' AS DateTime2))
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] OFF;
GO