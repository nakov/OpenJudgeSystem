﻿namespace OJS.Tests.Common
{
    using System.Data.Entity;

    using MongoDB.Driver;

    using OJS.Data;
    using OJS.Tests.Common.DataFakes;

    public abstract class TestClassBase
    {
        protected TestClassBase()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<FakeOjsDbContext, DatabaseConfiguration>());
            this.OjsData = new OjsData(new FakeOjsDbContext(), new MongoClient());
            this.InitializeEmptyOjsData();
        }

        protected IOjsData EmptyOjsData { get; private set; }

        protected IOjsData OjsData { get; private set; }

        protected void InitializeEmptyOjsData()
        {
            Database.SetInitializer(new DropCreateDatabaseAlways<FakeEmptyOjsDbContext>());
            var fakeEmptyOjsDbContext = new FakeEmptyOjsDbContext();
            fakeEmptyOjsDbContext.Database.Initialize(true);
            this.EmptyOjsData = new OjsData(fakeEmptyOjsDbContext, new MongoClient());
        }
    }
}
