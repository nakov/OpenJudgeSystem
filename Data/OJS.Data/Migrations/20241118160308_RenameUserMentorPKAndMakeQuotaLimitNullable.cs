using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OJS.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenameUserMentorPKAndMakeQuotaLimitNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UsersMentors_AspNetUsers_UserId",
                table: "UsersMentors");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "UsersMentors",
                newName: "Id");

            migrationBuilder.AlterColumn<int>(
                name: "QuotaLimit",
                table: "UsersMentors",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_UsersMentors_AspNetUsers_Id",
                table: "UsersMentors",
                column: "Id",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UsersMentors_AspNetUsers_Id",
                table: "UsersMentors");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "UsersMentors",
                newName: "UserId");

            migrationBuilder.AlterColumn<int>(
                name: "QuotaLimit",
                table: "UsersMentors",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UsersMentors_AspNetUsers_UserId",
                table: "UsersMentors",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
