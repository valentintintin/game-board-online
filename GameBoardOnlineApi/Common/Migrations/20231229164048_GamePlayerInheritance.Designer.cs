﻿// <auto-generated />
using System;
using Common.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Common.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20231229164048_GamePlayerInheritance")]
    partial class GamePlayerInheritance
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.0");

            modelBuilder.Entity("Common.Context.Room", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("DataJson")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("TEXT");

                    b.Property<Guid>("OwnerId")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.ToTable("Rooms");
                });

            modelBuilder.Entity("Common.Context.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("TEXT");

                    b.Property<Guid?>("RoomId")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("RoomId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Common.Models.Game", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Games");

                    b.HasDiscriminator<string>("Name").HasValue("Game");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Common.Models.Player", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("GameId")
                        .HasColumnType("TEXT");

                    b.Property<string>("GameName")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("GameId");

                    b.HasIndex("UserId");

                    b.ToTable("Players");

                    b.HasDiscriminator<string>("GameName").HasValue("Player");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Common.Games.CodeNames.Models.CodeNamesGame", b =>
                {
                    b.HasBaseType("Common.Models.Game");

                    b.Property<int>("TeamBeginning")
                        .HasColumnType("INTEGER");

                    b.HasDiscriminator().HasValue("CodeNamesGame");
                });

            modelBuilder.Entity("Common.Games.CodeNames.Models.CodeNamesPlayer", b =>
                {
                    b.HasBaseType("Common.Models.Player");

                    b.Property<bool>("IsGuesser")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Team")
                        .HasColumnType("INTEGER");

                    b.HasDiscriminator().HasValue("CodeNamesPlayer");
                });

            modelBuilder.Entity("Common.Context.Room", b =>
                {
                    b.HasOne("Common.Context.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("Common.Context.User", b =>
                {
                    b.HasOne("Common.Context.Room", null)
                        .WithMany("Users")
                        .HasForeignKey("RoomId");
                });

            modelBuilder.Entity("Common.Models.Player", b =>
                {
                    b.HasOne("Common.Models.Game", "Game")
                        .WithMany("Players")
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Common.Context.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Common.Context.Room", b =>
                {
                    b.Navigation("Users");
                });

            modelBuilder.Entity("Common.Models.Game", b =>
                {
                    b.Navigation("Players");
                });
#pragma warning restore 612, 618
        }
    }
}
