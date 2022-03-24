USE AppDb;

create table Courses
(
    Id int identity
        constraint PK_Courses
            primary key
)
go

SET IDENTITY_INSERT Courses ON;

INSERT INTO Courses (Id) VALUES (1);
INSERT INTO Courses (Id) VALUES (2);
INSERT INTO Courses (Id) VALUES (3);
INSERT INTO Courses (Id) VALUES (4);
INSERT INTO Courses (Id) VALUES (5);
INSERT INTO Courses (Id) VALUES (6);

SET IDENTITY_INSERT Courses OFF;