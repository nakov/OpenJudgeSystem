#nullable disable

namespace OJS.Data.Migrations
{
    using Microsoft.EntityFrameworkCore.Migrations;

    /// <inheritdoc />
    public partial class SetNullForEmptyFilesInProblemResources : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder) =>
            migrationBuilder.Sql(@"
                    UPDATE ProblemResources
                    SET [File] = NULL, [FileExtension] = NULL
                    WHERE [File] is not null and DATALENGTH([File]) = 0;");

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}