namespace OJS.Data.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class SubmissionsForProcessingDropTable : DbMigration
    {
        public override void Up()
        {
            this.DropTable("dbo.SubmissionsForProcessing");
        }
        
        public override void Down()
        {
            this.CreateTable(
                "dbo.SubmissionsForProcessing",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SubmissionId = c.Int(nullable: false),
                        Processing = c.Boolean(nullable: false),
                        Processed = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
    }
}
