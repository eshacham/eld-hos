using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HosDemo.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DriverHosSnapshots",
                columns: table => new
                {
                    DriverId = table.Column<Guid>(type: "uuid", nullable: false),
                    RecordedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    VendorId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    AvailableHours = table.Column<int>(type: "integer", nullable: true),
                    AvailableDrivingTime = table.Column<decimal>(type: "numeric", nullable: true),
                    AvailableOnDutyTime = table.Column<decimal>(type: "numeric", nullable: true),
                    Available6070 = table.Column<decimal>(type: "numeric", nullable: true),
                    DutyStatus = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DriverHosSnapshots", x => new { x.DriverId, x.RecordedAt });
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DriverHosSnapshots");
        }
    }
}
