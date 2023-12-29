using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Common.Migrations
{
    /// <inheritdoc />
    public partial class Entities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Games",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "Entities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false),
                    GameName = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false),
                    OwnerId = table.Column<Guid>(type: "TEXT", nullable: true),
                    LastActorTouchedId = table.Column<Guid>(type: "TEXT", nullable: true),
                    X = table.Column<int>(type: "INTEGER", nullable: false),
                    Y = table.Column<int>(type: "INTEGER", nullable: false),
                    Width = table.Column<int>(type: "INTEGER", nullable: false),
                    Height = table.Column<int>(type: "INTEGER", nullable: false),
                    Rotation = table.Column<int>(type: "INTEGER", nullable: false),
                    CanMove = table.Column<bool>(type: "INTEGER", nullable: false),
                    CanFlip = table.Column<bool>(type: "INTEGER", nullable: false),
                    CanRotate = table.Column<bool>(type: "INTEGER", nullable: false),
                    CanBeDeleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    OnlyForOwner = table.Column<bool>(type: "INTEGER", nullable: false),
                    CanBeShownToOthers = table.Column<bool>(type: "INTEGER", nullable: false),
                    ShowBack = table.Column<bool>(type: "INTEGER", nullable: false),
                    AllowFlipOnce = table.Column<bool>(type: "INTEGER", nullable: false),
                    ShadowColor = table.Column<string>(type: "TEXT", nullable: true),
                    Image = table.Column<string>(type: "TEXT", nullable: false),
                    ImageBack = table.Column<string>(type: "TEXT", nullable: true),
                    GameId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Word = table.Column<string>(type: "TEXT", nullable: true),
                    Team = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Entities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Entities_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Entities_Players_LastActorTouchedId",
                        column: x => x.LastActorTouchedId,
                        principalTable: "Players",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Entities_Players_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Players",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Entities_GameId",
                table: "Entities",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_Entities_LastActorTouchedId",
                table: "Entities",
                column: "LastActorTouchedId");

            migrationBuilder.CreateIndex(
                name: "IX_Entities_OwnerId",
                table: "Entities",
                column: "OwnerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Entities");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Games");
        }
    }
}
