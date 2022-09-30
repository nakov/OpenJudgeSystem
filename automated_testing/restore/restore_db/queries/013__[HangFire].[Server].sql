USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] ON;
GO

INSERT INTO [HangFire].[Server] ([Id], [Data], [LastHeartbeat])
VALUES (N'59615a44d33c:7:f42face1-4307-4428-97b4-317a5a46870c', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-09-16T05:24:23.4197199Z"}', CAST(N'2022-09-16T05:27:23+00:00' AS DateTime2)),
(N'd3b6f3917bbe:7:1fd0503a-b72f-40d8-91c7-4b94e0c4e594', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2022-09-16T05:24:23.9617484Z"}', CAST(N'2022-09-16T05:27:24+00:00' AS DateTime2))
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[HangFire].[Server]'))
    SET IDENTITY_INSERT [HangFire].[Server] OFF;
GO