-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('customer', 'kasir', 'admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('aktif', 'nonaktif');

-- CreateEnum
CREATE TYPE "FilmAgeRating" AS ENUM ('SU', 'R13', 'D17', 'D21');

-- CreateEnum
CREATE TYPE "FilmStatus" AS ENUM ('tayang', 'segera', 'selesai');

-- CreateEnum
CREATE TYPE "StudioType" AS ENUM ('reguler', 'imax', 'fourDX', 'dolby');

-- CreateEnum
CREATE TYPE "StudioStatus" AS ENUM ('aktif', 'maintenance');

-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('reguler', 'vip', 'couple');

-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('aktif', 'nonaktif');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('aktif', 'selesai', 'dibatalkan');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('dipesan', 'terkonfirmasi', 'dibatalkan', 'expired');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'success', 'failed', 'expired', 'refunded');

-- CreateEnum
CREATE TYPE "SnackCategory" AS ENUM ('makanan', 'minuman', 'combo');

-- CreateEnum
CREATE TYPE "SnackStatus" AS ENUM ('tersedia', 'habis');

-- CreateEnum
CREATE TYPE "VoucherType" AS ENUM ('persen', 'nominal');

-- CreateEnum
CREATE TYPE "PromoType" AS ENUM ('beli2gratis1', 'diskon_hari', 'diskon_member');

-- CreateEnum
CREATE TYPE "PointHistoryType" AS ENUM ('tambah', 'kurang');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('info', 'sukses', 'peringatan', 'promo');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userPassword" TEXT NOT NULL,
    "userPhone" TEXT,
    "userRole" "UserRole" NOT NULL DEFAULT 'customer',
    "userPhoto" TEXT,
    "userStatus" "UserStatus" NOT NULL DEFAULT 'aktif',
    "userEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "userCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDetail" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userDetailBirthDate" TIMESTAMP(3),
    "userDetailAddress" TEXT,
    "userDetailCity" TEXT,
    "userDetailGender" TEXT,
    "userDetailPoints" INTEGER NOT NULL DEFAULT 0,
    "userDetailMemberTier" TEXT NOT NULL DEFAULT 'bronze',
    "userDetailUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resetToken" TEXT NOT NULL,
    "resetExpiredAt" TIMESTAMP(3) NOT NULL,
    "resetUsed" BOOLEAN NOT NULL DEFAULT false,
    "resetCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "sessionIpAddress" TEXT,
    "sessionUserAgent" TEXT,
    "sessionExpiredAt" TIMESTAMP(3) NOT NULL,
    "sessionCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Film" (
    "id" TEXT NOT NULL,
    "filmTitle" TEXT NOT NULL,
    "filmGenre" TEXT NOT NULL,
    "filmDuration" INTEGER NOT NULL,
    "filmAgeRating" "FilmAgeRating" NOT NULL DEFAULT 'SU',
    "filmScore" DOUBLE PRECISION,
    "filmPoster" TEXT,
    "filmTrailerUrl" TEXT,
    "filmSynopsis" TEXT,
    "filmLanguage" TEXT,
    "filmSubtitle" TEXT,
    "filmDirector" TEXT,
    "filmCast" TEXT,
    "filmStatus" "FilmStatus" NOT NULL DEFAULT 'segera',
    "filmCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filmUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Film_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Studio" (
    "id" TEXT NOT NULL,
    "studioName" TEXT NOT NULL,
    "studioType" "StudioType" NOT NULL DEFAULT 'reguler',
    "studioCapacity" INTEGER NOT NULL,
    "studioTotalRows" INTEGER NOT NULL,
    "studioTotalColumns" INTEGER NOT NULL,
    "studioStatus" "StudioStatus" NOT NULL DEFAULT 'aktif',
    "studioCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Studio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seat" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "seatCode" TEXT NOT NULL,
    "seatRow" INTEGER NOT NULL,
    "seatColumn" INTEGER NOT NULL,
    "seatType" "SeatType" NOT NULL DEFAULT 'reguler',
    "seatStatus" "SeatStatus" NOT NULL DEFAULT 'aktif',
    "seatCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "filmId" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "scheduleDate" TIMESTAMP(3) NOT NULL,
    "scheduleTimeStart" TIMESTAMP(3) NOT NULL,
    "scheduleTimeEnd" TIMESTAMP(3) NOT NULL,
    "schedulePriceRegular" INTEGER NOT NULL,
    "schedulePriceVip" INTEGER NOT NULL,
    "schedulePriceCouple" INTEGER NOT NULL,
    "scheduleStatus" "ScheduleStatus" NOT NULL DEFAULT 'aktif',
    "scheduleCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduleUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeatReservation" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "transactionId" TEXT,
    "reservationStatus" "ReservationStatus" NOT NULL DEFAULT 'dipesan',
    "reservationLockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reservationExpiredAt" TIMESTAMP(3),
    "reservationCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeatReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "transactionCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "transactionSubtotal" INTEGER NOT NULL,
    "transactionAdminFee" INTEGER NOT NULL,
    "transactionSnackTotal" INTEGER NOT NULL DEFAULT 0,
    "transactionGrandTotal" INTEGER NOT NULL,
    "transactionDiscountAmount" INTEGER NOT NULL DEFAULT 0,
    "transactionVoucherId" TEXT,
    "transactionPointsUsed" INTEGER NOT NULL DEFAULT 0,
    "transactionPaymentMethod" TEXT,
    "transactionStatus" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "transactionMidtransOrderId" TEXT,
    "transactionMidtransTransactionId" TEXT,
    "transactionMidtransPaymentType" TEXT,
    "transactionMidtransVaNumber" TEXT,
    "transactionSnapToken" TEXT,
    "transactionPaidAt" TIMESTAMP(3),
    "transactionExpiredAt" TIMESTAMP(3),
    "transactionCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "ticketBarcodeCode" TEXT NOT NULL,
    "ticketQrCode" TEXT NOT NULL,
    "ticketScanStatus" TEXT NOT NULL DEFAULT 'belum',
    "ticketScannedAt" TIMESTAMP(3),
    "ticketScannedByStaffId" TEXT,
    "ticketPdfUrl" TEXT,
    "ticketCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnackMenu" (
    "id" TEXT NOT NULL,
    "snackName" TEXT NOT NULL,
    "snackDescription" TEXT,
    "snackPrice" INTEGER NOT NULL,
    "snackImage" TEXT,
    "snackCategory" "SnackCategory" NOT NULL DEFAULT 'makanan',
    "snackStock" INTEGER NOT NULL DEFAULT 0,
    "snackStatus" "SnackStatus" NOT NULL DEFAULT 'tersedia',
    "snackCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snackUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SnackMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnackOrder" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "snackId" TEXT NOT NULL,
    "snackOrderQuantity" INTEGER NOT NULL,
    "snackOrderUnitPrice" INTEGER NOT NULL,
    "snackOrderSubtotal" INTEGER NOT NULL,
    "snackOrderCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SnackOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voucher" (
    "id" TEXT NOT NULL,
    "voucherCode" TEXT NOT NULL,
    "voucherName" TEXT NOT NULL,
    "voucherType" "VoucherType" NOT NULL DEFAULT 'persen',
    "voucherValue" INTEGER NOT NULL,
    "voucherMinPurchase" INTEGER NOT NULL DEFAULT 0,
    "voucherMaxDiscount" INTEGER,
    "voucherQuota" INTEGER NOT NULL,
    "voucherUsedCount" INTEGER NOT NULL DEFAULT 0,
    "voucherStartDate" TIMESTAMP(3) NOT NULL,
    "voucherEndDate" TIMESTAMP(3) NOT NULL,
    "voucherStatus" "UserStatus" NOT NULL DEFAULT 'aktif',
    "voucherCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoucherUsage" (
    "id" TEXT NOT NULL,
    "voucherId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "voucherUsageCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoucherUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promo" (
    "id" TEXT NOT NULL,
    "promoName" TEXT NOT NULL,
    "promoDescription" TEXT,
    "promoType" "PromoType" NOT NULL DEFAULT 'diskon_hari',
    "promoDiscountValue" INTEGER NOT NULL,
    "promoStartDate" TIMESTAMP(3) NOT NULL,
    "promoEndDate" TIMESTAMP(3) NOT NULL,
    "promoStatus" "UserStatus" NOT NULL DEFAULT 'aktif',
    "promoCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Promo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionId" TEXT,
    "pointHistoryAmount" INTEGER NOT NULL,
    "pointHistoryType" "PointHistoryType" NOT NULL DEFAULT 'tambah',
    "pointHistoryDescription" TEXT,
    "pointHistoryCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "filmId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "reviewScore" INTEGER NOT NULL,
    "reviewComment" TEXT,
    "reviewStatus" TEXT NOT NULL DEFAULT 'tampil',
    "reviewCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Waitlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "waitlistSeatType" TEXT NOT NULL DEFAULT 'reguler',
    "waitlistStatus" TEXT NOT NULL DEFAULT 'menunggu',
    "waitlistNotifiedAt" TIMESTAMP(3),
    "waitlistCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notificationTitle" TEXT NOT NULL,
    "notificationMessage" TEXT NOT NULL,
    "notificationType" "NotificationType" NOT NULL DEFAULT 'info',
    "notificationIsRead" BOOLEAN NOT NULL DEFAULT false,
    "notificationChannel" TEXT DEFAULT 'app',
    "notificationCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "auditLogAction" TEXT NOT NULL,
    "auditLogModule" TEXT NOT NULL,
    "auditLogDescription" TEXT,
    "auditLogOldData" JSONB,
    "auditLogNewData" JSONB,
    "auditLogIpAddress" TEXT,
    "auditLogCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL,
    "settingKey" TEXT NOT NULL,
    "settingValue" TEXT NOT NULL,
    "settingDescription" TEXT,
    "settingUpdatedByUserId" TEXT,
    "settingUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "User"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetail_userId_key" ON "UserDetail"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_resetToken_key" ON "PasswordReset"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionCode_key" ON "Transaction"("transactionCode");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionMidtransOrderId_key" ON "Transaction"("transactionMidtransOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_ticketBarcodeCode_key" ON "Ticket"("ticketBarcodeCode");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_ticketQrCode_key" ON "Ticket"("ticketQrCode");

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_voucherCode_key" ON "Voucher"("voucherCode");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_settingKey_key" ON "SystemSetting"("settingKey");

-- AddForeignKey
ALTER TABLE "UserDetail" ADD CONSTRAINT "UserDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatReservation" ADD CONSTRAINT "SeatReservation_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatReservation" ADD CONSTRAINT "SeatReservation_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatReservation" ADD CONSTRAINT "SeatReservation_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_transactionVoucherId_fkey" FOREIGN KEY ("transactionVoucherId") REFERENCES "Voucher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_ticketScannedByStaffId_fkey" FOREIGN KEY ("ticketScannedByStaffId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnackOrder" ADD CONSTRAINT "SnackOrder_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnackOrder" ADD CONSTRAINT "SnackOrder_snackId_fkey" FOREIGN KEY ("snackId") REFERENCES "SnackMenu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoucherUsage" ADD CONSTRAINT "VoucherUsage_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "Voucher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoucherUsage" ADD CONSTRAINT "VoucherUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoucherUsage" ADD CONSTRAINT "VoucherUsage_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointHistory" ADD CONSTRAINT "PointHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointHistory" ADD CONSTRAINT "PointHistory_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waitlist" ADD CONSTRAINT "Waitlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waitlist" ADD CONSTRAINT "Waitlist_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemSetting" ADD CONSTRAINT "SystemSetting_settingUpdatedByUserId_fkey" FOREIGN KEY ("settingUpdatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
