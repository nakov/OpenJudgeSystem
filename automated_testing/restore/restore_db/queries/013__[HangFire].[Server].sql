USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] ON;
GO

INSERT INTO [HangFire].[Server] ([Id], [Data], [LastHeartbeat])
VALUES (N'47a3009cf3f6:7:ac72b8bb-04e4-4f89-8514-b86f3640f4fc', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-09-28T09:48:16.3535106Z"}', CAST(N'2022-09-28T09:49:16+00:00' AS DateTime2)),
(N'47a3009cf3f6:7:f4352b67-5524-4991-bb43-92f6523e1402', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-09-28T09:19:18.5952291Z"}', CAST(N'2022-09-28T09:38:49+00:00' AS DateTime2)),
(N'9a626ca2260d:7:2822e8bb-203a-4133-80a8-d48eba422cfc', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-09-28T09:19:18.0865167Z"}', CAST(N'2022-09-28T09:38:48+00:00' AS DateTime2)),
(N'9a626ca2260d:7:ab1cab26-fd0e-4d1d-b24c-b4bfbc2ccfad', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-09-28T09:48:16.3535107Z"}', CAST(N'2022-09-28T09:49:16+00:00' AS DateTime2))
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] OFF;
GO