using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OJS.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedDefaultSubmissionTypeForProblem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSelectedByDefault",
                table: "SubmissionTypes");

            migrationBuilder.AddColumn<int>(
                name: "DefaultSubmissionTypeId",
                table: "Problems",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Problems_DefaultSubmissionTypeId",
                table: "Problems",
                column: "DefaultSubmissionTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Problems_SubmissionTypes_DefaultSubmissionTypeId",
                table: "Problems",
                column: "DefaultSubmissionTypeId",
                principalTable: "SubmissionTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Problems_SubmissionTypes_DefaultSubmissionTypeId",
                table: "Problems");

            migrationBuilder.DropIndex(
                name: "IX_Problems_DefaultSubmissionTypeId",
                table: "Problems");

            migrationBuilder.DropColumn(
                name: "DefaultSubmissionTypeId",
                table: "Problems");

            migrationBuilder.AddColumn<bool>(
                name: "IsSelectedByDefault",
                table: "SubmissionTypes",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
