using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OJS.Data.Migrations
{
    using System;

    /// <inheritdoc />
    public partial class SetResourcesType1To3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
            => migrationBuilder.Sql(@"UPDATE ProblemResources
                                      SET Type = 1
                                      WHERE RIGHT(Link, CHARINDEX('.', REVERSE(Link)) - 1) = 'docx'
                                      AND Type = 3;");

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /*
             * No implementation is provided for the 'Down' method because the 'Up' migration
             * performs an irreversible update. Specifically, it sets the Type of all .docx resources from 1 to 3,
             * which cannot be undone without losing data integrity.
             * This is a deliberate choice to ensure that the database does not contain any
             * unnecessary or misleading data.
             */

            throw new NotSupportedException("This migration cannot be rolled back.");
        }
    }
}
