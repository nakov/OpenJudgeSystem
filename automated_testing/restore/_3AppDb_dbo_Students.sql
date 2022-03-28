USE AppDb;

create table Students
(
    Id       int identity
        constraint PK_Students
            primary key,
    Name     nvarchar(max) not null,
    CourseId int
        constraint FK_Students_Courses_CourseId
            references Courses
)
go

create index IX_Students_CourseId
    on Students (CourseId)
go

SET IDENTITY_INSERT Students ON;

INSERT INTO Students (Id, Name, CourseId) VALUES (1, N'Pesho', 1);
INSERT INTO Students (Id, Name, CourseId) VALUES (2, N'Gosho', 2);
INSERT INTO Students (Id, Name, CourseId) VALUES (3, N'Maria', 3);
INSERT INTO Students (Id, Name, CourseId) VALUES (4, N'Doncho', 1);
INSERT INTO Students (Id, Name, CourseId) VALUES (5, N'Mila', 2);
INSERT INTO Students (Id, Name, CourseId) VALUES (6, N'Simona', 3);

SET IDENTITY_INSERT Students OFF;