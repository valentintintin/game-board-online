using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Common.Migrations
{
    /// <inheritdoc />
    public partial class ChangeRandomize : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Randomize",
                table: "EntitiesGroups",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(string),
                oldType: "character varying(16)",
                oldMaxLength: 16,
                oldNullable: true);
            
            migrationBuilder.AlterColumn<bool>(
                name: "CanRemoveNotUsed",
                table: "EntitiesGroups",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "GiveToPlayer",
                table: "EntitiesGroups",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "NumberToGiveToPlayer",
                table: "EntitiesGroups",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GiveToPlayer",
                table: "EntitiesGroups");

            migrationBuilder.DropColumn(
                name: "NumberToGiveToPlayer",
                table: "EntitiesGroups");

            migrationBuilder.AlterColumn<string>(
                name: "Randomize",
                table: "EntitiesGroups",
                type: "character varying(16)",
                maxLength: 16,
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AlterColumn<bool>(
                name: "CanRemoveNotUsed",
                table: "EntitiesGroups",
                type: "boolean",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "boolean");
        }
    }
}
