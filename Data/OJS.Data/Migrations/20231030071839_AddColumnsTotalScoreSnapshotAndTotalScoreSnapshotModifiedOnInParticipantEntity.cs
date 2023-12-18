#nullable disable

namespace OJS.Data.Migrations
{
using System;
using Microsoft.EntityFrameworkCore.Migrations;
public partial class AddColumnsTotalScoreSnapshotAndTotalScoreSnapshotModifiedOnInParticipantEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TotalScoreSnapshot",
                table: "Participants",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "TotalScoreSnapshotModifiedOn",
                table: "Participants",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalScoreSnapshot",
                table: "Participants");

            migrationBuilder.DropColumn(
                name: "TotalScoreSnapshotModifiedOn",
                table: "Participants");
        }
    }
}
