#nullable disable

namespace OJS.Data.Migrations
{
    using System;
    using Microsoft.EntityFrameworkCore.Migrations;

    /// <inheritdoc />
    public partial class AddedProcessingStateToSubmissionForProcessing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Processed",
                table: "SubmissionsForProcessing");

            migrationBuilder.DropColumn(
                name: "Processing",
                table: "SubmissionsForProcessing");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "EnqueuedAt",
                table: "SubmissionsForProcessing",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ProcessedAt",
                table: "SubmissionsForProcessing",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ProcessingStartedAt",
                table: "SubmissionsForProcessing",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "State",
                table: "SubmissionsForProcessing",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnqueuedAt",
                table: "SubmissionsForProcessing");

            migrationBuilder.DropColumn(
                name: "ProcessedAt",
                table: "SubmissionsForProcessing");

            migrationBuilder.DropColumn(
                name: "ProcessingStartedAt",
                table: "SubmissionsForProcessing");

            migrationBuilder.DropColumn(
                name: "State",
                table: "SubmissionsForProcessing");

            migrationBuilder.AddColumn<bool>(
                name: "Processed",
                table: "SubmissionsForProcessing",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Processing",
                table: "SubmissionsForProcessing",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
