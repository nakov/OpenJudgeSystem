using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OJS.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveProblemShowResultsProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShowResults",
                table: "Problems");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ShowResults",
                table: "Problems",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
