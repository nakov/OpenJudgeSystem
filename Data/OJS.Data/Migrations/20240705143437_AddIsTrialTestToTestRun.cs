#nullable disable

namespace OJS.Data.Migrations
{
    using Microsoft.EntityFrameworkCore.Migrations;

    public partial class AddIsTrialTestToTestRun : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsTrialTest",
                table: "TestRuns",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsTrialTest",
                table: "TestRuns");
        }
    }
}
