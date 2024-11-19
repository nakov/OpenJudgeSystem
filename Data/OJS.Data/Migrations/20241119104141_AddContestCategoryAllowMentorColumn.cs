using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OJS.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddContestCategoryAllowMentorColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AllowMentor",
                table: "ContestCategories",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AllowMentor",
                table: "ContestCategories");
        }
    }
}
