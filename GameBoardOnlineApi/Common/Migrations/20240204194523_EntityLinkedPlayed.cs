using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Common.Migrations
{
    /// <inheritdoc />
    public partial class EntityLinkedPlayed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "LinkToId",
                table: "EntityPlayed",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_EntityPlayed_LinkToId",
                table: "EntityPlayed",
                column: "LinkToId");

            migrationBuilder.AddForeignKey(
                name: "FK_EntityPlayed_EntityPlayed_LinkToId",
                table: "EntityPlayed",
                column: "LinkToId",
                principalTable: "EntityPlayed",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EntityPlayed_EntityPlayed_LinkToId",
                table: "EntityPlayed");

            migrationBuilder.DropIndex(
                name: "IX_EntityPlayed_LinkToId",
                table: "EntityPlayed");

            migrationBuilder.DropColumn(
                name: "LinkToId",
                table: "EntityPlayed");
        }
    }
}
