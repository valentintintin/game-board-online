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
    [Migration("20231231124619_Chat")]
    partial class Chat
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0")
                .HasAnnotation("Proxies:ChangeTracking", false)
                .HasAnnotation("Proxies:CheckEquality", false)
                .HasAnnotation("Proxies:LazyLoading", true);

            modelBuilder.Entity("Common.Context.ChatMessage", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("TEXT");

                    b.Property<Guid>("RoomId")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("RoomId");

                    b.HasIndex("UserId");

                    b.ToTable("ChatMessages");
                });

            modelBuilder.Entity("Common.Context.Entity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<bool>("AllowFlipOnce")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("CanBeDeleted")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("CanBeShownToOthers")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("CanFlip")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("CanMove")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("CanRotate")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasMaxLength(21)
                        .HasColumnType("TEXT");

                    b.Property<Guid>("GameId")
                        .HasColumnType("TEXT");

                    b.Property<int>("Height")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("ImageBack")
                        .HasColumnType("TEXT");

                    b.Property<Guid?>("LastActorTouchedId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("TEXT");

                    b.Property<bool>("OnlyForOwner")
                        .HasColumnType("INTEGER");

                    b.Property<Guid?>("OwnerId")
                        .HasColumnType("TEXT");

                    b.Property<int>("Rotation")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ShadowColor")
                        .HasColumnType("TEXT");

                    b.Property<bool>("ShowBack")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Width")
                        .HasColumnType("INTEGER");

                    b.Property<int>("X")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Y")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("GameId");

                    b.HasIndex("LastActorTouchedId");

                    b.HasIndex("OwnerId");

                    b.ToTable("Entities");

                    b.HasDiscriminator<string>("Discriminator").HasValue("Entity");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Common.Context.Game", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<Guid?>("CurrentPlayerId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("TEXT");

                    b.Property<string>("State")
                        .HasColumnType("TEXT");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasMaxLength(13)
                        .HasColumnType("TEXT")
                        .HasColumnName("Discriminator");

                    b.Property<Guid?>("WinnerPlayerId")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CurrentPlayerId");

                    b.HasIndex("WinnerPlayerId");

                    b.ToTable("Games");

                    b.HasDiscriminator<string>("Type").HasValue("Game");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Common.Context.Player", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasMaxLength(21)
                        .HasColumnType("TEXT");

                    b.Property<Guid>("GameId")
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

                    b.HasDiscriminator<string>("Discriminator").HasValue("Player");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Common.Context.Room", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<Guid?>("CurrentGameId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("TEXT");

                    b.Property<Guid?>("OwnerId")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CurrentGameId");

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

            modelBuilder.Entity("Common.Context.VirtualEntity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasMaxLength(13)
                        .HasColumnType("TEXT");

                    b.Property<Guid>("GameId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("TEXT");

                    b.Property<Guid?>("OwnerId")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("GameId");

                    b.HasIndex("OwnerId");

                    b.ToTable("VirtualEntities");

                    b.HasDiscriminator<string>("Discriminator").HasValue("VirtualEntity");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Common.Games.CodeNames.Models.CodeNamesWordCard", b =>
                {
                    b.HasBaseType("Common.Context.Entity");

                    b.Property<Guid?>("CodeNamesGameId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Team")
                        .IsRequired()
                        .HasMaxLength(16)
                        .HasColumnType("TEXT");

                    b.Property<string>("Word")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasIndex("CodeNamesGameId");

                    b.HasDiscriminator().HasValue("CodeNamesWordCard");
                });

            modelBuilder.Entity("Common.Games.CodeNames.Models.CodeNamesGame", b =>
                {
                    b.HasBaseType("Common.Context.Game");

                    b.Property<int?>("CurrentTeam")
                        .HasColumnType("INTEGER");

                    b.Property<string>("TeamBeginning")
                        .IsRequired()
                        .HasMaxLength(16)
                        .HasColumnType("TEXT");

                    b.Property<int?>("WinnerTeam")
                        .HasColumnType("INTEGER");

                    b.HasDiscriminator().HasValue("CodeNamesGame");
                });

            modelBuilder.Entity("Common.Games.CodeNames.Models.CodeNamesPlayer", b =>
                {
                    b.HasBaseType("Common.Context.Player");

                    b.Property<bool>("IsGuesser")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Team")
                        .HasColumnType("INTEGER");

                    b.HasDiscriminator().HasValue("CodeNamesPlayer");
                });

            modelBuilder.Entity("Common.Games.CodeNames.Models.CodeNamesHint", b =>
                {
                    b.HasBaseType("Common.Context.VirtualEntity");

                    b.Property<Guid?>("CodeNamesGameId")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsInfinite")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Nb")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Word")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasIndex("CodeNamesGameId");

                    b.HasDiscriminator().HasValue("CodeNamesHint");
                });

            modelBuilder.Entity("Common.Context.ChatMessage", b =>
                {
                    b.HasOne("Common.Context.Room", "Room")
                        .WithMany("ChatMessages")
                        .HasForeignKey("RoomId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Common.Context.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Room");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Common.Context.Entity", b =>
                {
                    b.HasOne("Common.Context.Game", "Game")
                        .WithMany()
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Common.Context.Player", "LastActorTouched")
                        .WithMany()
                        .HasForeignKey("LastActorTouchedId");

                    b.HasOne("Common.Context.Player", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId");

                    b.Navigation("Game");

                    b.Navigation("LastActorTouched");

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("Common.Context.Game", b =>
                {
                    b.HasOne("Common.Context.Player", "CurrentPlayer")
                        .WithMany()
                        .HasForeignKey("CurrentPlayerId");

                    b.HasOne("Common.Context.Player", "WinnerPlayer")
                        .WithMany()
                        .HasForeignKey("WinnerPlayerId");

                    b.Navigation("CurrentPlayer");

                    b.Navigation("WinnerPlayer");
                });

            modelBuilder.Entity("Common.Context.Player", b =>
                {
                    b.HasOne("Common.Context.Game", "Game")
                        .WithMany("Players")
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Common.Context.User", "User")
                        .WithMany("Players")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Common.Context.Room", b =>
                {
                    b.HasOne("Common.Context.Game", "CurrentGame")
                        .WithMany()
                        .HasForeignKey("CurrentGameId");

                    b.HasOne("Common.Context.User", "Owner")
                        .WithMany("RoomsCreated")
                        .HasForeignKey("OwnerId");

                    b.Navigation("CurrentGame");

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("Common.Context.User", b =>
                {
                    b.HasOne("Common.Context.Room", null)
                        .WithMany("Users")
                        .HasForeignKey("RoomId");
                });

            modelBuilder.Entity("Common.Context.VirtualEntity", b =>
                {
                    b.HasOne("Common.Context.Game", "Game")
                        .WithMany()
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Common.Context.Player", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId");

                    b.Navigation("Game");

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("Common.Games.CodeNames.Models.CodeNamesWordCard", b =>
                {
                    b.HasOne("Common.Games.CodeNames.Models.CodeNamesGame", null)
                        .WithMany("Words")
                        .HasForeignKey("CodeNamesGameId");
                });

            modelBuilder.Entity("Common.Games.CodeNames.Models.CodeNamesHint", b =>
                {
                    b.HasOne("Common.Games.CodeNames.Models.CodeNamesGame", null)
                        .WithMany("Hints")
                        .HasForeignKey("CodeNamesGameId");
                });

            modelBuilder.Entity("Common.Context.Game", b =>
                {
                    b.Navigation("Players");
                });

            modelBuilder.Entity("Common.Context.Room", b =>
                {
                    b.Navigation("ChatMessages");

                    b.Navigation("Users");
                });

            modelBuilder.Entity("Common.Context.User", b =>
                {
                    b.Navigation("Players");

                    b.Navigation("RoomsCreated");
                });

            modelBuilder.Entity("Common.Games.CodeNames.Models.CodeNamesGame", b =>
                {
                    b.Navigation("Hints");

                    b.Navigation("Words");
                });
#pragma warning restore 612, 618
        }
    }
}
