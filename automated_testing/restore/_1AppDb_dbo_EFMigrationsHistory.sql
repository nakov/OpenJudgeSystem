USE AppDb;

create table __EFMigrationsHistory
(
    MigrationId    nvarchar(150) not null
        constraint PK___EFMigrationsHistory
            primary key,
    ProductVersion nvarchar(32)  not null
)
go

INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion) VALUES (N'20220119124042_initial', N'6.0.1');
INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion) VALUES (N'20220119141315_added course', N'6.0.1');