#nullable disable

namespace OJS.Data.Migrations
{
    using Microsoft.EntityFrameworkCore.Migrations;
    using System;

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
            /*
             * No implementation is provided for the 'Down' method because the 'Up' migration
             * performs an irreversible update. Specifically, it sets the 'File' and 'FileExtension'
             * columns to NULL for empty files, which cannot be undone without losing data integrity.
             * This is a deliberate choice to ensure that the database does not contain any
             * unnecessary or misleading data, such as empty file records.
             */

            throw new NotSupportedException("This migration cannot be rolled back.");
        }
    }
}