#nullable disable

namespace OJS.Data.Migrations
{
    using Microsoft.EntityFrameworkCore.Migrations;

    public partial class MadeParticipantRequiredForSubmission : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Submissions_Participants_ParticipantId",
                table: "Submissions");

            migrationBuilder.AlterColumn<int>(
                name: "ParticipantId",
                table: "Submissions",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Submissions_Participants_ParticipantId",
                table: "Submissions",
                column: "ParticipantId",
                principalTable: "Participants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Submissions_Participants_ParticipantId",
                table: "Submissions");

            migrationBuilder.AlterColumn<int>(
                name: "ParticipantId",
                table: "Submissions",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Submissions_Participants_ParticipantId",
                table: "Submissions",
                column: "ParticipantId",
                principalTable: "Participants",
                principalColumn: "Id");
        }
    }
}
