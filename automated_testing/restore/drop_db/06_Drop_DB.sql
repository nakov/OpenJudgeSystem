-- DROP DATABASE [OpenJudgeSystem];
-- GO
-- USE [OpenJudgeSystem]
-- GO
-- EXEC sp_msforeachtable 'drop table [?]'
-- GO
USE [OpenJudgeSystem]
GO
    EXEC sys.sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'
GO
    EXEC sys.sp_msforeachtable 'DELETE FROM ?'
GO
    EXEC sys.sp_MSForEachTable 'ALTER TABLE ? CHECK CONSTRAINT ALL'
GO