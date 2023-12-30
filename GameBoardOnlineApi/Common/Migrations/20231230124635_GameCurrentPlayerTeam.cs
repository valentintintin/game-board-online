using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Common.Migrations
{
    /// <inheritdoc />
    public partial class GameCurrentPlayerTeam : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CurrentPlayerId",
                table: "Games",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CurrentTeam",
                table: "Games",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Games_CurrentPlayerId",
                table: "Games",
                column: "CurrentPlayerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_Players_CurrentPlayerId",
                table: "Games",
                column: "CurrentPlayerId",
                principalTable: "Players",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_Players_CurrentPlayerId",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_Games_CurrentPlayerId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "CurrentPlayerId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "CurrentTeam",
                table: "Games");
        }
    }
}
