Sistem Tiket Bioskop — Konsep & Struktur (Versi Lengkap)
Peran Pengguna (User Roles)
Sistem ini memiliki 3 peran berbeda:
Pelanggan (Customer) — bisa register, login, browse film, beli tiket, bayar via Midtrans, dan melihat riwayat tiket di akun mereka.
Kasir/Staff — bisa login, scan barcode penonton yang masuk, dan melihat jadwal hari ini.
Admin — akses penuh ke semua fitur termasuk kelola film, jadwal, laporan keuangan, dan manajemen pengguna.

Struktur Database (Revisi Lengkap)

Tabel users
userId (UUID, PK) | userName | userEmail | userPassword (hashed) | userPhone | userRole (customer/kasir/admin) | userPhoto | userStatus (aktif/nonaktif) | userEmailVerified (boolean) | userCreatedAt | userUpdatedAt

Tabel userDetails
userDetailId (UUID, PK) | userDetailUserId (FK → users.userId) | userDetailBirthDate | userDetailAddress | userDetailCity | userDetailGender | userDetailPoints | userDetailMemberTier (bronze/silver/gold) | userDetailUpdatedAt

Tabel passwordResets
resetId (UUID, PK) | resetUserId (FK → users.userId) | resetToken | resetExpiredAt | resetUsed (boolean) | resetCreatedAt

Tabel sessions
sessionId (UUID, PK) | sessionUserId (FK → users.userId) | sessionToken | sessionIpAddress | sessionUserAgent | sessionExpiredAt | sessionCreatedAt

Tabel films
filmId (UUID, PK) | filmTitle | filmGenre | filmDuration (menit) | filmAgeRating (SU/13+/17+/21+) | filmScore | filmPoster | filmTrailerUrl | filmSynopsis | filmLanguage | filmSubtitle | filmDirector | filmCast | filmStatus (tayang/segera/selesai) | filmCreatedAt | filmUpdatedAt

Tabel studios
studioId (UUID, PK) | studioName | studioType (reguler/imax/4dx/dolby) | studioCapacity | studioTotalRows | studioTotalColumns | studioStatus (aktif/maintenance) | studioCreatedAt

Tabel seats
seatId (UUID, PK) | seatStudioId (FK → studios.studioId) | seatCode (contoh: A1, B5) | seatRow | seatColumn | seatType (reguler/vip/couple) | seatStatus (aktif/nonaktif) | seatCreatedAt

Tabel schedules
scheduleId (UUID, PK) | scheduleFilmId (FK → films.filmId) | scheduleStudioId (FK → studios.studioId) | scheduleDate | scheduleTimeStart | scheduleTimeEnd | schedulePriceRegular | schedulePriceVip | schedulePriceCouple | scheduleStatus (aktif/selesai/dibatalkan) | scheduleCreatedAt | scheduleUpdatedAt

Tabel seatReservations
reservationId (UUID, PK) | reservationScheduleId (FK → schedules.scheduleId) | reservationSeatId (FK → seats.seatId) | reservationTransactionId (FK → transactions.transactionId) | reservationStatus (dipesan/terkonfirmasi/dibatalkan/expired) | reservationLockedAt | reservationExpiredAt | reservationCreatedAt

Tabel transactions
transactionId (UUID, PK) | transactionCode (unik, contoh: TRX-20240413-00234) | transactionUserId (FK → users.userId) | transactionScheduleId (FK → schedules.scheduleId) | transactionSubtotal | transactionAdminFee | transactionSnackTotal | transactionGrandTotal | transactionDiscountAmount | transactionVoucherId (FK → vouchers.voucherId, nullable) | transactionPointsUsed | transactionPaymentMethod | transactionStatus (pending/success/failed/expired/refunded) | transactionMidtransOrderId | transactionMidtransTransactionId | transactionMidtransPaymentType | transactionMidtransVaNumber | transactionSnapToken | transactionPaidAt | transactionExpiredAt | transactionCreatedAt | transactionUpdatedAt

Tabel tickets
ticketId (UUID, PK) | ticketTransactionId (FK → transactions.transactionId) | ticketSeatId (FK → seats.seatId) | ticketScheduleId (FK → schedules.scheduleId) | ticketBarcodeCode (unik, SHA-256) | ticketQrCode (unik) | ticketScanStatus (belum/sudah/batal) | ticketScannedAt | ticketScannedByStaffId (FK → users.userId, nullable) | ticketPdfUrl | ticketCreatedAt

Tabel snackMenus
snackId (UUID, PK) | snackName | snackDescription | snackPrice | snackImage | snackCategory (makanan/minuman/combo) | snackStock | snackStatus (tersedia/habis) | snackCreatedAt | snackUpdatedAt

Tabel snackOrders
snackOrderId (UUID, PK) | snackOrderTransactionId (FK → transactions.transactionId) | snackOrderSnackId (FK → snackMenus.snackId) | snackOrderQuantity | snackOrderUnitPrice | snackOrderSubtotal | snackOrderCreatedAt

Tabel vouchers
voucherId (UUID, PK) | voucherCode | voucherName | voucherType (persen/nominal) | voucherValue | voucherMinPurchase | voucherMaxDiscount | voucherQuota | voucherUsedCount | voucherStartDate | voucherEndDate | voucherStatus (aktif/nonaktif) | voucherCreatedAt

Tabel voucherUsage
voucherUsageId (UUID, PK) | voucherUsageVoucherId (FK → vouchers.voucherId) | voucherUsageUserId (FK → users.userId) | voucherUsageTransactionId (FK → transactions.transactionId) | voucherUsageCreatedAt

Tabel promos
promoId (UUID, PK) | promoName | promoDescription | promoType (beli2gratis1/diskon_hari/diskon_member) | promoDiscountValue | promoStartDate | promoEndDate | promoStatus (aktif/nonaktif) | promoCreatedAt

Tabel pointHistory
pointHistoryId (UUID, PK) | pointHistoryUserId (FK → users.userId) | pointHistoryTransactionId (FK → transactions.transactionId, nullable) | pointHistoryAmount | pointHistoryType (tambah/kurang) | pointHistoryDescription | pointHistoryCreatedAt

Tabel reviews
reviewId (UUID, PK) | reviewUserId (FK → users.userId) | reviewFilmId (FK → films.filmId) | reviewTransactionId (FK → transactions.transactionId) | reviewScore (1-5) | reviewComment | reviewStatus (tampil/disembunyikan) | reviewCreatedAt | reviewUpdatedAt

Tabel waitlists
waitlistId (UUID, PK) | waitlistUserId (FK → users.userId) | waitlistScheduleId (FK → schedules.scheduleId) | waitlistSeatType (reguler/vip) | waitlistStatus (menunggu/notified/expired) | waitlistNotifiedAt | waitlistCreatedAt

Tabel notifications
notificationId (UUID, PK) | notificationUserId (FK → users.userId) | notificationTitle | notificationMessage | notificationType (info/sukses/peringatan/promo) | notificationIsRead (boolean) | notificationChannel (app/email/whatsapp) | notificationCreatedAt

Tabel auditLogs
auditLogId (UUID, PK) | auditLogUserId (FK → users.userId) | auditLogAction (login/edit_film/refund/dll) | auditLogModule (film/jadwal/transaksi/user) | auditLogDescription | auditLogOldData (JSON) | auditLogNewData (JSON) | auditLogIpAddress | auditLogCreatedAt

Tabel systemSettings
settingId (UUID, PK) | settingKey | settingValue | settingDescription | settingUpdatedByUserId (FK → users.userId) | settingUpdatedAt

Relasi Antar Tabel
users → userDetails (one to one) | users → sessions (one to many) | films → schedules (one to many) | studios → seats (one to many) | schedules → seatReservations (one to many) | transactions → tickets (one to many) | transactions → snackOrders (one to many) | users → transactions (one to many) | users → reviews (one to many) | films → reviews (one to many) | vouchers → voucherUsage (one to many) | users → pointHistory (one to many) | users → waitlists (one to many) | users → notifications (one to many) | users → auditLogs (one to many)

Alur Sistem Login & Register
Pelanggan baru mengisi form register dengan nama, email, password, dan nomor HP. Sistem mengirim email verifikasi. Setelah terverifikasi, akun aktif dan bisa login. Login menggunakan email dan password, lalu sistem memberikan token sesi. Jika lupa password, ada fitur reset via email. Admin dan kasir akunnya dibuat langsung oleh admin, tidak bisa self-register atau seeder prisma.

Alur Sistem Pembayaran Midtrans Sandbox
Langkah 1 — Buat Order: Setelah pelanggan konfirmasi pesanan, sistem membuat record transaksi dengan status "pending" dan menyimpan midtrans_order_id yang unik.
Langkah 2 — Request ke Midtrans: Backend mengirim data pesanan ke Midtrans Snap API menggunakan server key. Midtrans mengembalikan snap_token.
Langkah 3 — Tampilkan Payment Gateway: Frontend membuka popup Midtrans Snap menggunakan snap_token. Pelanggan memilih metode bayar, bisa berupa transfer bank, QRIS, GoPay, OVO, ShopeePay, kartu kredit, atau Indomaret/Alfamart.
Langkah 4 — Notifikasi dari Midtrans (Webhook): Setelah pembayaran selesai, Midtrans mengirim notifikasi ke endpoint webhook di server. Sistem memverifikasi signature key lalu mengupdate status transaksi menjadi "success", mengupdate status kursi menjadi "terkonfirmasi", dan membuat tiket beserta kode barcode.
Langkah 5 — Tiket Dikirim: Sistem mengirim email ke pelanggan berisi tiket PDF dengan barcode, lalu notifikasi masuk ke akun pelanggan.
Langkah 6 — Kursi Expired Otomatis: Jika pembayaran tidak selesai dalam 15 menit, status transaksi berubah menjadi "expired" dan kursi dilepas kembali agar bisa dipesan orang lain.

Struktur Tampilan (Halaman)
Halaman Publik (belum login):

Landing page — hero banner film unggulan, film sedang tayang, dan film segera hadir.
Halaman login dan register.
Halaman detail film — sinopsis, trailer, jadwal tayang, ulasan.
Halaman lupa password dan reset password.

Halaman Pelanggan (sudah login):

Dashboard akun — riwayat tiket, poin reward, notifikasi.
Alur pembelian tiket yang terdiri dari 5 langkah yaitu pilih film, pilih jadwal, pilih kursi, tambah snack, dan isi data lalu bayar.
Halaman tiket digital — menampilkan barcode, detail film, kursi, dan tombol download PDF.
Halaman riwayat transaksi — semua transaksi beserta statusnya.
Halaman profil — edit data diri, ganti password, riwayat poin.

Halaman Kasir:

Halaman scan barcode — kamera real-time atau input kode manual.
Halaman jadwal hari ini — daftar film yang tayang beserta jumlah tiket terjual.

Halaman Admin:

Dashboard — statistik tiket, pendapatan, grafik penjualan per hari/minggu.
Kelola film — tambah, edit, nonaktifkan film.
Kelola jadwal — atur jam tayang, studio, harga.
Kelola studio & kursi — konfigurasi denah kursi.
Kelola snack — tambah menu, update stok.
Manajemen user — lihat semua user, ubah role, nonaktifkan akun.
Laporan transaksi — filter berdasarkan tanggal, film, status bayar, ekspor ke Excel/PDF.
Pengaturan sistem — konfigurasi Midtrans key, biaya admin, durasi expired tiket.


