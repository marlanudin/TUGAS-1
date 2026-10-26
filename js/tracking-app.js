// TRACKING DELIVERY ORDER - VUE

// MENGAMBIL DATA AWAL
var sumberData = app.$data;

// KONFIGURASI POPUP TRACKING
var trackingPopup = {
    customClass: {
        popup: 'tracking-popup',
        title: 'tracking-popup-title',
        htmlContainer: 'tracking-popup-text',
        confirmButton: 'tracking-popup-button',
        cancelButton: 'tracking-popup-cancel',
        input: 'tracking-popup-input'
    },
    buttonsStyling: false,
    reverseButtons: true
};

// FUNGSI MENAMPILKAN POPUP TRACKING
function tampilkanTrackingPopup(opsi) {
    return Swal.fire(
        Object.assign({}, trackingPopup, opsi)
    );
}

// MEMBUAT INSTANCE VUE TRACKING
var trackingApp = new Vue({
    el: '#tracking-app',

    // DATA APLIKASI
    data: {
        upbjjList: sumberData.upbjjList,
        paketList: sumberData.paket,
        stok: sumberData.stok,
        ekspedisiList: sumberData.pengirimanList,

        // FORM DELIVERY ORDER
        form: {
            nim: '',
            nama: '',
            ekspedisi: '',
            kodePaket: '',
            tanggalKirim: new Date().toISOString().slice(0, 10)
        },

        // DAFTAR DELIVERY ORDER
        daftarDO: Object.keys(sumberData.tracking).map(function (nomor) {
            var item = sumberData.tracking[nomor];

            var paket = sumberData.paket.find(function (p) {
                return p.kode === item.paket;
            });

            return {
                nomorDO: nomor,
                nim: item.nim,
                nama: item.nama,
                ekspedisi: item.ekspedisi,
                kodePaket: item.paket,
                namaPaket: paket ? paket.nama : '',
                tanggalKirim: item.tanggalKirim,
                total: item.total,
                status: item.status,
                perjalanan: item.perjalanan
            };
        }),

        // PESAN DAN VALIDASI
        pesan: '',
        errors: []
    },

    // COMPUTED
    computed: {

        // MEMBUAT NOMOR DO BARU
        nomorDOBaru: function () {
            var tahun = new Date().getFullYear();
            var prefix = 'DO' + tahun + '-';

            var nomorTerbesar = this.daftarDO.reduce(function (terbesar, item) {
                if (item.nomorDO.indexOf(prefix) !== 0) {
                    return terbesar;
                }

                var angka = parseInt(
                    item.nomorDO.slice(prefix.length),
                    10
                );

                return Number.isFinite(angka)
                    ? Math.max(terbesar, angka)
                    : terbesar;
            }, 0);

            return prefix + String(nomorTerbesar + 1).padStart(3, '0');
        },

        // MENCARI PAKET YANG DIPILIH
        paketDipilih: function () {
            return this.paketList.find(function (item) {
                return item.kode === this.form.kodePaket;
            }, this) || null;
        },

        // MENGHITUNG TOTAL HARGA PAKET
        totalHarga: function () {
            return this.paketDipilih ? this.paketDipilih.harga : 0;
        }
    },

    // METHODS
    methods: {

        // FORMAT MATA UANG RUPIAH
        formatRupiah: function (angka) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
            }).format(Number(angka) || 0);
        },

        // MENCARI JUDUL BAHAN AJAR
        judulBahan: function (kode) {
            var bahan = this.stok.find(function (item) {
                return item.kode === kode;
            });

            return bahan ? bahan.judul : 'Judul tidak ditemukan';
        },

        // MENAMBAHKAN DELIVERY ORDER
        tambahDO: function () {
            var formValid =
                this.form.nim.trim() !== '' &&
                this.form.nama.trim() !== '' &&
                this.form.ekspedisi !== '' &&
                this.form.kodePaket !== '' &&
                this.form.tanggalKirim !== '' &&
                this.paketDipilih !== null;

            // VALIDASI FORMULIR
            if (!formValid) {
                this.pesan = 'Lengkapi semua data terlebih dahulu.';
                this.errors = [
                    'Pastikan semua kolom terisi dan paket sudah dipilih.'
                ];

                tampilkanTrackingPopup({
                    icon: 'warning',
                    title: 'Data Belum Lengkap',
                    text: 'Lengkapi semua kolom sebelum menambahkan Delivery Order.',
                    confirmButtonText: 'Periksa Kembali'
                });

                return;
            }

            // MENGAMBIL PAKET YANG DIPILIH
            var paket = this.paketDipilih;

            // MEMBUAT DATA DELIVERY ORDER BARU
            var itemBaru = {
                nomorDO: this.nomorDOBaru,
                nim: this.form.nim.trim(),
                nama: this.form.nama.trim(),
                ekspedisi: this.form.ekspedisi,
                kodePaket: paket.kode,
                namaPaket: paket.nama,
                tanggalKirim: this.form.tanggalKirim,
                total: paket.harga,
                status: 'Diproses',
                perjalanan: []
            };

            // MENAMBAHKAN DATA KE DAFTAR DO
            this.daftarDO.push(itemBaru);

            this.pesan = 'Delivery Order berhasil ditambahkan.';
            this.errors = [];

            // POPUP KEBERHASILAN
            tampilkanTrackingPopup({
                icon: 'success',
                title: 'DO Berhasil Ditambahkan',
                html:
                    '<div class="tracking-popup-detail">' +
                        '<p>Delivery Order berhasil dibuat.</p>' +
                        '<div class="tracking-popup-number">' +
                            itemBaru.nomorDO +
                        '</div>' +
                        '<p class="tracking-popup-caption">' +
                            'Simpan nomor DO untuk keperluan pelacakan.' +
                        '</p>' +
                    '</div>',
                confirmButtonText: 'Selesai'
            });

            // MEMBERSIHKAN FORMULIR
            this.bersihkanForm();
        },

        // MENGATUR TANGGAL PENGIRIMAN
        isiTanggalHariIni: function () {
            var sekarang = new Date();
            var tahun = sekarang.getFullYear();
            var bulan = String(sekarang.getMonth() + 1).padStart(2, '0');
            var tanggal = String(sekarang.getDate()).padStart(2, '0');

            this.form.tanggalKirim =
                tahun + '-' + bulan + '-' + tanggal;
        },

        // MEMBERSIHKAN FORMULIR
        bersihkanForm: function () {
            this.form = {
                nim: '',
                nama: '',
                ekspedisi: '',
                kodePaket: '',
                tanggalKirim: new Date().toISOString().slice(0, 10)
            };

            this.errors = [];
        }
    }
});