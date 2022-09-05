USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] ON;
GO

INSERT INTO [HangFire].[Server] ([Id], [Data], [LastHeartbeat])
VALUES (N'548c454deaee:7:1d15fe7c-8047-42df-88f4-0224ade8f5cc', N'{"WorkerCount":10,"Queues":["default"],"StartedAt":"2022-09-05T10:20:20.8496447Z"}', CAST(N'2022-09-05T10:20:20+00:00' AS DateTime2)),
(N'60a215f2b311:7:668a3808-c413-469f-bf02-3bbca36dec8e', N'{"WorkerCount":10,"Queues":["default"],"StartedAt":"2022-09-05T10:20:21.3515322Z"}', CAST(N'2022-09-05T10:20:21+00:00' AS DateTime2)),
(N'd9f0ec0246fd:7:97d08d89-673c-4142-945d-26a68d2de752', N'{"WorkerCount":10,"Queues":["default"],"StartedAt":"2022-09-05T10:24:47.1773952Z"}', CAST(N'2022-09-05T10:25:47+00:00' AS DateTime2)),
(N'dfa263736ff4:7:12db7c55-dab3-4326-991d-23bb42de05b8', N'{"WorkerCount":10,"Queues":["default"],"StartedAt":"2022-09-05T10:24:47.7473665Z"}', CAST(N'2022-09-05T10:25:47+00:00' AS DateTime2))
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] OFF;
GO