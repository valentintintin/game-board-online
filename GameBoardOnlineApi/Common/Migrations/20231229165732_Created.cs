using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Common.Migrations
{
    /// <inheritdoc />
    public partial class Created : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DataJson",
                table: "Rooms",
                newName: "CurrentGameId");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_CurrentGameId",
                table: "Rooms",
                column: "CurrentGameId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_Games_CurrentGameId",
                table: "Rooms",
                column: "CurrentGameId",
                principalTable: "Games",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_Games_CurrentGameId",
                table: "Rooms");

            migrationBuilder.DropIndex(
                name: "IX_Rooms_CurrentGameId",
                table: "Rooms");

            migrationBuilder.RenameColumn(
                name: "CurrentGameId",
                table: "Rooms",
                newName: "DataJson");
        }
    }
}
