#nullable disable

namespace OJS.Data.Migrations
{
    using Microsoft.EntityFrameworkCore.Migrations;

    public partial class AddedTimeAndMemoryConstraintsInSubmissionType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BaseMemoryUsedInBytes",
                table: "SubmissionTypes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BaseTimeUsedInMilliseconds",
                table: "SubmissionTypes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxAllowedMemoryLimitInBytes",
                table: "SubmissionTypes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxAllowedTimeLimitInMilliseconds",
                table: "SubmissionTypes",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BaseMemoryUsedInBytes",
                table: "SubmissionTypes");

            migrationBuilder.DropColumn(
                name: "BaseTimeUsedInMilliseconds",
                table: "SubmissionTypes");

            migrationBuilder.DropColumn(
                name: "MaxAllowedMemoryLimitInBytes",
                table: "SubmissionTypes");

            migrationBuilder.DropColumn(
                name: "MaxAllowedTimeLimitInMilliseconds",
                table: "SubmissionTypes");
        }
    }
}
