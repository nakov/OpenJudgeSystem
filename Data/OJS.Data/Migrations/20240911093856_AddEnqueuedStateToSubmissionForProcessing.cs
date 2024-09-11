#nullable disable

namespace OJS.Data.Migrations
{
    using System;
    using Microsoft.EntityFrameworkCore.Migrations;

    /// <inheritdoc />
    public partial class AddEnqueuedStateToSubmissionForProcessing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Enqueued",
                table: "SubmissionsForProcessing",
                type: "bit",
                nullable: false,
                defaultValue: false);

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Enqueued",
                table: "SubmissionsForProcessing");

            migrationBuilder.DropColumn(
                name: "EnqueuedAt",
                table: "SubmissionsForProcessing");

            migrationBuilder.DropColumn(
                name: "ProcessedAt",
                table: "SubmissionsForProcessing");

            migrationBuilder.DropColumn(
                name: "ProcessingStartedAt",
                table: "SubmissionsForProcessing");
        }
    }
}
