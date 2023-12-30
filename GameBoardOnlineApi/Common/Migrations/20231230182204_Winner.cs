using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Common.Migrations
{
    /// <inheritdoc />
    public partial class Winner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsInfinite",
                table: "VirtualEntities",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Games",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "WinnerPlayerId",
                table: "Games",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WinnerTeam",
                table: "Games",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Games_WinnerPlayerId",
                table: "Games",
                column: "WinnerPlayerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_Players_WinnerPlayerId",
                table: "Games",
                column: "WinnerPlayerId",
                principalTable: "Players",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_Players_WinnerPlayerId",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_Games_WinnerPlayerId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "IsInfinite",
                table: "VirtualEntities");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "WinnerPlayerId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "WinnerTeam",
                table: "Games");
        }
    }
}
