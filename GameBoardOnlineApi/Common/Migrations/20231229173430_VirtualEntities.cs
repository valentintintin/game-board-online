using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Common.Migrations
{
    /// <inheritdoc />
    public partial class VirtualEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_Users_OwnerId",
                table: "Rooms");

            migrationBuilder.AlterColumn<Guid>(
                name: "OwnerId",
                table: "Rooms",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AddColumn<Guid>(
                name: "CodeNamesGameId",
                table: "Entities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "VirtualEntities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    GameName = table.Column<string>(type: "TEXT", maxLength: 13, nullable: false),
                    GameId = table.Column<Guid>(type: "TEXT", nullable: false),
                    OwnerId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Word = table.Column<string>(type: "TEXT", nullable: true),
                    Nb = table.Column<int>(type: "INTEGER", nullable: true),
                    CodeNamesGameId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VirtualEntities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VirtualEntities_Games_CodeNamesGameId",
                        column: x => x.CodeNamesGameId,
                        principalTable: "Games",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_VirtualEntities_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VirtualEntities_Players_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Players",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Entities_CodeNamesGameId",
                table: "Entities",
                column: "CodeNamesGameId");

            migrationBuilder.CreateIndex(
                name: "IX_VirtualEntities_CodeNamesGameId",
                table: "VirtualEntities",
                column: "CodeNamesGameId");

            migrationBuilder.CreateIndex(
                name: "IX_VirtualEntities_GameId",
                table: "VirtualEntities",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_VirtualEntities_OwnerId",
                table: "VirtualEntities",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Entities_Games_CodeNamesGameId",
                table: "Entities",
                column: "CodeNamesGameId",
                principalTable: "Games",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_Users_OwnerId",
                table: "Rooms",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entities_Games_CodeNamesGameId",
                table: "Entities");

            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_Users_OwnerId",
                table: "Rooms");

            migrationBuilder.DropTable(
                name: "VirtualEntities");

            migrationBuilder.DropIndex(
                name: "IX_Entities_CodeNamesGameId",
                table: "Entities");

            migrationBuilder.DropColumn(
                name: "CodeNamesGameId",
                table: "Entities");

            migrationBuilder.AlterColumn<Guid>(
                name: "OwnerId",
                table: "Rooms",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_Users_OwnerId",
                table: "Rooms",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
