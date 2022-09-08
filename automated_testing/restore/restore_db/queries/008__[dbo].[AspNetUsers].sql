USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[AspNetUsers]'))
    SET IDENTITY_INSERT [dbo].[AspNetUsers] ON;
GO

INSERT INTO [dbo].[AspNetUsers] ([Id], [Email], [FirstName], [LastName], [City], [EducationalInstitution], [FacultyNumber], [DateOfBirth], [Company], [JobTitle], [IsDeleted], [DeletedOn], [CreatedOn], [ModifiedOn], [UserName], [NormalizedUserName], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount])
VALUES (N'a88a0975-a888-4bac-84f0-bea59472804a', N'testuser12@gmail.com', N'Test', N'User12', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, CAST(N'2022-06-30T00:00:00+00:00' AS DateTime2), NULL, N'testuser12', N'TESTUSER12', NULL, 1, N'AQAAAAEAACcQAAAAEBnaeBnoV0aOG67PZKDbwptEVlz/8BkE2b3tjgtmiyY5RJisMHuS493xW6MTvbU7ZA==', N'a88f0975-a888-4bac-84f0-bea59472804a', NULL, NULL, 1, 0, NULL, 0, 0),
(N'f88a0975-a888-4bac-84f0-bea59472804a', N'testuser123@gmail.com', N'Test', N'User123', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, CAST(N'2022-06-30T00:00:00+00:00' AS DateTime2), NULL, N'testuser123', N'TESTUSER123', NULL, 1, N'AQAAAAEAACcQAAAAEKdA3LrRWqR5KaXzFIiuhIQzgd0lUXx+sp+IV/qbs7l8S+HKSnbmVuHD59h54vKFuA==', N'a88f0975-a888-4bac-84f0-bea59472804a', NULL, NULL, 1, 0, NULL, 0, 0)
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'[dbo].[AspNetUsers]'))
    SET IDENTITY_INSERT [dbo].[AspNetUsers] OFF;
GO