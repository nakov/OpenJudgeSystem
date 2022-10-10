using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OJS.Data.Migrations
{
    public partial class Addsolutionskeletonpersubmissiontype : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "SolutionSkeleton",
                table: "SubmissionTypeProblems",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SolutionSkeleton",
                table: "SubmissionTypeProblems");
        }
    }
}
