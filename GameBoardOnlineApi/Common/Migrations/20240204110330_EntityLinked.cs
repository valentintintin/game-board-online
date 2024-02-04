using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Common.Migrations
{
    /// <inheritdoc />
    public partial class EntityLinked : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "DeleteWithLink",
                table: "Entities",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<long>(
                name: "LinkToId",
                table: "Entities",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "MoveWithLink",
                table: "Entities",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Entities_LinkToId",
                table: "Entities",
                column: "LinkToId");

            migrationBuilder.AddForeignKey(
                name: "FK_Entities_Entities_LinkToId",
                table: "Entities",
                column: "LinkToId",
                principalTable: "Entities",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entities_Entities_LinkToId",
                table: "Entities");

            migrationBuilder.DropIndex(
                name: "IX_Entities_LinkToId",
                table: "Entities");

            migrationBuilder.DropColumn(
                name: "DeleteWithLink",
                table: "Entities");

            migrationBuilder.DropColumn(
                name: "LinkToId",
                table: "Entities");

            migrationBuilder.DropColumn(
                name: "MoveWithLink",
                table: "Entities");
        }
    }
}
