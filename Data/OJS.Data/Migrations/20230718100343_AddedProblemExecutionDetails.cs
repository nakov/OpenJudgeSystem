#nullable disable

namespace OJS.Data.Migrations
{
    using System;
    using Microsoft.EntityFrameworkCore.Migrations;

    public partial class AddedProblemExecutionDetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SubmissionTypeProblems");

            migrationBuilder.CreateTable(
                name: "ProblemSubmissionTypeExecutionDetails",
                columns: table => new
                {
                    SubmissionTypeId = table.Column<int>(type: "int", nullable: false),
                    ProblemId = table.Column<int>(type: "int", nullable: false),
                    SolutionSkeleton = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    TimeLimit = table.Column<int>(type: "int", nullable: true),
                    MemoryLimit = table.Column<int>(type: "int", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProblemSubmissionTypeExecutionDetails", x => new { x.SubmissionTypeId, x.ProblemId });
                    table.ForeignKey(
                        name: "FK_ProblemSubmissionTypeExecutionDetails_Problems_ProblemId",
                        column: x => x.ProblemId,
                        principalTable: "Problems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProblemSubmissionTypeExecutionDetails_SubmissionTypes_SubmissionTypeId",
                        column: x => x.SubmissionTypeId,
                        principalTable: "SubmissionTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProblemSubmissionTypeExecutionDetails_ProblemId",
                table: "ProblemSubmissionTypeExecutionDetails",
                column: "ProblemId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProblemSubmissionTypeExecutionDetails");

            migrationBuilder.CreateTable(
                name: "SubmissionTypeProblems",
                columns: table => new
                {
                    SubmissionTypeId = table.Column<int>(type: "int", nullable: false),
                    ProblemId = table.Column<int>(type: "int", nullable: false),
                    SolutionSkeleton = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubmissionTypeProblems", x => new { x.SubmissionTypeId, x.ProblemId });
                    table.ForeignKey(
                        name: "FK_SubmissionTypeProblems_Problems_ProblemId",
                        column: x => x.ProblemId,
                        principalTable: "Problems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SubmissionTypeProblems_SubmissionTypes_SubmissionTypeId",
                        column: x => x.SubmissionTypeId,
                        principalTable: "SubmissionTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SubmissionTypeProblems_ProblemId",
                table: "SubmissionTypeProblems",
                column: "ProblemId");
        }
    }
}
