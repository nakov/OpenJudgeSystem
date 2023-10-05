#nullable disable

namespace OJS.Data.Migrations
{
    using System;
    using Microsoft.EntityFrameworkCore.Migrations;

    public partial class AddProblemSubmissionTypeExecutionDetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "SubmissionTypeProblems",
                newName: "ProblemSubmissionTypeExecutionDetails");

            migrationBuilder.AddColumn<int>(
                name: "TimeLimit",
                table: "ProblemSubmissionTypeExecutionDetails",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MemoryLimit",
                table: "ProblemSubmissionTypeExecutionDetails",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeLimit",
                table: "ProblemSubmissionTypeExecutionDetails");

            migrationBuilder.DropColumn(
                name: "MemoryLimit",
                table: "ProblemSubmissionTypeExecutionDetails");

            migrationBuilder.RenameTable(
                name: "ProblemSubmissionTypeExecutionDetails",
                newName: "SubmissionTypeProblems");
        }
    }
}