#nullable disable

namespace OJS.Data.Migrations
{
    using Microsoft.EntityFrameworkCore.Migrations;

    public partial class MemoryAndTimeLimitsToProblem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MemoryLimit",
                table: "SubmissionTypeProblems",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TimeLimit",
                table: "SubmissionTypeProblems",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MemoryLimit",
                table: "SubmissionTypeProblems");

            migrationBuilder.DropColumn(
                name: "TimeLimit",
                table: "SubmissionTypeProblems");
        }
    }
}
