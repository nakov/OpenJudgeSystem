USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[SubmissionTypes]'))
    SET IDENTITY_INSERT [dbo].[SubmissionTypes] ON;
GO

INSERT INTO [dbo].[SubmissionTypes] ([Id], [Name], [IsSelectedByDefault], [ExecutionStrategyType], [CompilerType], [AdditionalCompilerArguments], [Description], [AllowBinaryFilesUpload], [AllowedFileExtensions])
VALUES (1, N'C# code', 1, 1, 1, N'/optimize+ /nologo /reference:System.Numerics.dll /reference:PowerCollections.dll', NULL, 0, NULL),
(2, N'C++ code', 0, 29, 3, N'-pipe -mtune=generic -O3 -static-libgcc -static-libstdc++ -std=c++11', NULL, 0, NULL),
(3, N'JavaScript code (NodeJS)', 0, 2, 0, N'', NULL, 0, NULL),
(4, N'C# project/solution', 0, 1, 2, N'/t:rebuild /p:Configuration=Release,Optimize=true /verbosity:quiet /nologo', NULL, 1, N'zip'),
(5, N'Java code', 0, 4, 4, N'-encoding utf8', NULL, 0, NULL),
(6, N'PHP code (CGI)', 0, 5, 0, N'', NULL, 0, NULL),
(7, N'PHP code (CLI)', 0, 6, 0, N'', NULL, 0, NULL),
(8, N'Plain text', 0, 7, 0, NULL, NULL, 0, NULL),
(9, N'Java zip file', 0, 8, 5, N'-encoding utf8', NULL, 1, N'zip'),
(11, N'Python code', 0, 9, 0, N'', NULL, 0, NULL),
(12, N'JavaScript code (Mocha unit tests)', 0, 11, 0, N'-R json', NULL, 0, NULL),
(13, N'JavaScript code (DOM unit tests)', 0, 12, 0, N'-R json', NULL, 0, NULL),
(14, N'SQL Server prepare DB & run queries', 0, 45, 0, NULL, NULL, 0, NULL),
(15, N'SQL Server run queries & check DB', 0, 46, 0, NULL, NULL, 0, NULL),
(16, N'SQL Server run skeleton, run queries & check DB', 0, 47, 0, NULL, NULL, 0, NULL),
(17, N'MySQL prepare DB & run queries', 0, 16, 0, NULL, NULL, 0, NULL),
(18, N'MySQL run queries & check DB', 0, 17, 0, NULL, NULL, 0, NULL),
(19, N'MySQL run skeleton, run queries & check DB', 0, 18, 0, NULL, NULL, 0, NULL),
(20, N'File upload', 0, 0, 0, N'', NULL, 1, N'zip,rar'),
(21, N'C# test runner', 0, 10, 2, N'/t:rebuild /p:Configuration=Release,Optimize=true /verbosity:quiet /nologo', NULL, 1, N'zip'),
(22, N'JavaScript Zip File (DOM, Mocha and Module Transpiling)', 0, 20, 0, N'--delay -R json', NULL, 1, N'zip'),
(23, N'JavaScript code (Unit Tests with Sinon and Mocha)', 0, 19, 0, N'-R json', NULL, 0, NULL),
(24, N'JavaScript code (Async DOM unit tests with React)', 0, 21, 0, N'-R json', NULL, 0, NULL),
(25, N'HTML and CSS Zip File (DOM and Mocha)', 0, 22, 0, N'-R json', NULL, 1, N'zip'),
(26, N'C# Unit Tests', 0, 23, 6, N'/t:rebuild /p:Configuration=Release,Optimize=true /verbosity:quiet /nologo', NULL, 1, N'zip'),
(27, N'C# Project Tests', 0, 24, 6, N'/t:rebuild /p:Configuration=Release,Optimize=true /verbosity:quiet /nologo', NULL, 1, N'zip'),
(28, N'Java Project Tests', 0, 25, 5, N'', NULL, 1, N'zip'),
(29, N'Java Unit Tests', 0, 27, 8, NULL, NULL, 1, N'zip'),
(30, N'C++ Zip File', 0, 26, 7, N'-pipe -mtune=generic -static-libgcc -static-libstdc++ -std=c++11', NULL, 1, N'zip'),
(31, N'C# ASP Project Tests', 0, 28, 6, N'/t:rebuild /p:Configuration=Release,Optimize=true /verbosity:quiet /nologo', NULL, 1, N'zip'),
(32, N'Java Project (Spring + Hibernate)', 0, 30, 5, N'-encoding utf8', NULL, 1, N'zip'),
(33, N'C# Performance Project Tests', 0, 31, 6, N'/t:rebuild /p:Configuration=Release,Optimize=true /verbosity:quiet /nologo', NULL, 1, N'zip'),
(34, N'Ruby Code', 0, 32, 0, NULL, NULL, 0, NULL),
(35, N'.NET Core Project', 0, 33, 9, NULL, NULL, 1, N'zip'),
(36, N'PHP Project', 0, 34, 0, NULL, NULL, 1, N'zip'),
(37, N'.NET Core Project Tests', 0, 35, 9, NULL, NULL, 1, N'zip'),
(38, N'PHP Project with DB', 0, 36, 0, NULL, NULL, 1, N'zip'),
(39, N'C# code (.NET Core)', 0, 37, 10, N'-nologo', NULL, 0, NULL),
(40, N'.NET Core Unit Tests', 0, 38, 9, NULL, NULL, 1, N'zip'),
(445, N'Solidity code', 0, 39, 11, NULL, NULL, 0, NULL),
(446, N'Python code (unittest unit tests)', 0, 42, 0, NULL, NULL, 0, NULL),
(447, N'Python Unit Tests (unittest)', 0, 41, 0, NULL, NULL, 0, NULL),
(448, N'Python Project (unittest unit tests)', 0, 43, 0, NULL, NULL, 1, N'zip'),
(449, N'Python Project Unit Tests (unittest)', 0, 44, 0, NULL, NULL, 1, N'zip'),
(450, N'JS Projects Mocha Unit Tests', 0, 48, 0, NULL, NULL, 1, N'zip'),
(451, N'.NET Core 6 Project Tests', 0, 50, 9, NULL, NULL, 1, N'zip'),
(452, N'.NET Core 5 Project Tests', 0, 51, 9, NULL, NULL, 1, N'zip'),
(453, N'.NET Core 5 Project	', 0, 56, 9, NULL, NULL, 1, N'zip'),
(454, N'.NET Core 6 Project', 0, 57, 9, NULL, NULL, 1, N'zip'),
(455, N'.NET Core 5 Unit Tests	', 0, 54, 9, NULL, NULL, 1, N'zip'),
(456, N'.NET Core 6 Unit Tests', 0, 55, 9, NULL, NULL, 1, N'zip'),
(457, N'C# code (.NET 5)', 0, 52, 10, N'-nologo', NULL, 0, NULL),
(458, N'C# code (.NET 6)', 0, 53, 10, N'-nologo', NULL, 0, NULL)
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[SubmissionTypes]'))
    SET IDENTITY_INSERT [dbo].[SubmissionTypes] OFF;
GO