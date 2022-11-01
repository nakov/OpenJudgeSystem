using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OJS.Data.Migrations
{
    public partial class RemoveSkeletonFieldFromProblemsTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SolutionSkeleton",
                table: "Problems");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "SolutionSkeleton",
                table: "Problems",
                type: "varbinary(max)",
                nullable: true);
        }
    }
}
