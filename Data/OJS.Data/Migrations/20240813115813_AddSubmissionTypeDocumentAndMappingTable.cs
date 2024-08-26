#nullable disable

namespace OJS.Data.Migrations
{
    using Microsoft.EntityFrameworkCore.Migrations;
    using System;

    /// <inheritdoc />
    public partial class AddSubmissionTypeDocumentAndMappingTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SubmissionTypeDocuments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OrderBy = table.Column<double>(type: "float", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubmissionTypeDocuments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SubmissionTypesInSubmissionDocuments",
                columns: table => new
                {
                    SubmissionTypeId = table.Column<int>(type: "int", nullable: false),
                    SubmissionTypeDocumentId = table.Column<int>(type: "int", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubmissionTypesInSubmissionDocuments", x => new { x.SubmissionTypeId, x.SubmissionTypeDocumentId });
                    table.ForeignKey(
                        name: "FK_SubmissionTypesInSubmissionDocuments_SubmissionTypeDocuments_SubmissionTypeDocumentId",
                        column: x => x.SubmissionTypeDocumentId,
                        principalTable: "SubmissionTypeDocuments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SubmissionTypesInSubmissionDocuments_SubmissionTypes_SubmissionTypeId",
                        column: x => x.SubmissionTypeId,
                        principalTable: "SubmissionTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SubmissionTypesInSubmissionDocuments_SubmissionTypeDocumentId",
                table: "SubmissionTypesInSubmissionDocuments",
                column: "SubmissionTypeDocumentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SubmissionTypesInSubmissionDocuments");

            migrationBuilder.DropTable(
                name: "SubmissionTypeDocuments");
        }
    }
}
