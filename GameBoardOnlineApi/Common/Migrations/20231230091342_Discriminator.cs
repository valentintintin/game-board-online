using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Common.Migrations
{
    /// <inheritdoc />
    public partial class Discriminator : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GameName",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "GameName",
                table: "Entities");

            migrationBuilder.RenameColumn(
                name: "GameName",
                table: "VirtualEntities",
                newName: "Discriminator");

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Players",
                type: "TEXT",
                maxLength: 21,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Entities",
                type: "TEXT",
                maxLength: 21,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Entities");

            migrationBuilder.RenameColumn(
                name: "Discriminator",
                table: "VirtualEntities",
                newName: "GameName");

            migrationBuilder.AddColumn<string>(
                name: "GameName",
                table: "Players",
                type: "TEXT",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GameName",
                table: "Entities",
                type: "TEXT",
                maxLength: 64,
                nullable: false,
                defaultValue: "");
        }
    }
}
