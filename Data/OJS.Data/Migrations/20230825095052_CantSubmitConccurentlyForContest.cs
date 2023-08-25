#nullable disable

namespace OJS.Data.Migrations
{
    using Microsoft.EntityFrameworkCore.Migrations;

    public partial class CantSubmitConccurentlyForContest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CantSubmitConcurrently",
                table: "Contests",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CantSubmitConcurrently",
                table: "Contests");
        }
    }
}
