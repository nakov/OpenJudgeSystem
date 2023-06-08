namespace OJS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ExectuionCommentAndExceptionType : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Submissions", "ExecutionComment", c => c.String());
            AddColumn("dbo.Submissions", "ExceptionType", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Submissions", "ExceptionType");
            DropColumn("dbo.Submissions", "ExecutionComment");
        }
    }
}
