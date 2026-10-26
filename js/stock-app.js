/* INFORMASI STOK BAHAN AJAR - VUE */

/* Mengambil data awal dari instance Vue pada dataBahanAjar.js */
var dataAwal = app.$data;

/* Konfigurasi tampilan popup SweetAlert2 */
var stockPopup = {
    customClass: {
        popup: 'stock-popup',
        title: 'stock-popup-title',
        htmlContainer: 'stock-popup-text',
        confirmButton: 'stock-popup-button',
        cancelButton: 'stock-popup-cancel',
        input: 'stock-popup-input'
    },
    buttonsStyling: false
};

/* Menampilkan popup dengan konfigurasi tampilan khusus */
function tampilkanStockPopup(opsi) {
    return Swal.fire(
        Object.assign({}, stockPopup, opsi)
    );
}

/* Membuat instance Vue khusus halaman informasi stok bahan ajar */
var stockApp = new Vue({
    /* Menentukan elemen HTML yang dikelola oleh Vue */
    el: '#stock-app',

    /* DATA: Menyimpan data bahan ajar, filter, formulir, dan pesan */
    data: {
        daftarBahanAjar: dataAwal.stok,
        upbjjList: dataAwal.upbjjList,
        kategoriList: dataAwal.kategoriList,

        /* Nilai awal filter dan pengurutan data */
        filterUPBJJ: '',
        filterKategori: '',
        filterStok: 'semua',
        kataKunci: '',
        urutkan: 'judul-asc',

        /* Menyimpan nilai input pada formulir bahan ajar */
        form: {
            kode: '',
            judul: '',
            kategori: '',
            upbjj: '',
            lokasiRak: '',
            qty: 0,
            safety: 0,
            harga: 0,
            catatanHTML: ''
        },

        /* Menyimpan status edit, pesan, dan kesalahan validasi */
        formEdit: null,
        pesan: '',
        jenisPesan: 'info',
        errors: []
    },

    /* COMPUTED: Mengolah data secara otomatis berdasarkan perubahan data terkait */
    computed: {

        /* Menampilkan kategori yang tersedia sesuai UT-Daerah terpilih */
        kategoriTersedia: function () {
            if (!this.filterUPBJJ) {
                return this.kategoriList;
            }

            var kategoriDaerah = this.daftarBahanAjar
                .filter(function (item) {
                    return item.upbjj === this.filterUPBJJ;
                }, this)
                .map(function (item) {
                    return item.kategori;
                });

            return this.kategoriList.filter(function (kategori) {
                return kategoriDaerah.indexOf(kategori) !== -1;
            });
        },

        /* Menyaring dan mengurutkan daftar bahan ajar berdasarkan filter */
        bahanAjarTerfilter: function () {
            var hasil = this.daftarBahanAjar.filter(function (item) {

                /* Memeriksa kesesuaian UT-Daerah */
                var cocokUPBJJ =
                    !this.filterUPBJJ ||
                    item.upbjj === this.filterUPBJJ;

                /* Memeriksa kesesuaian kategori */
                var cocokKategori =
                    !this.filterKategori ||
                    item.kategori === this.filterKategori;

                /* Memeriksa kata kunci pada kode, judul, dan lokasi rak */
                var kata = this.kataKunci.toLowerCase();

                var cocokKata =
                    !kata ||
                    (
                        item.kode + ' ' +
                        item.judul + ' ' +
                        item.lokasiRak
                    ).toLowerCase().includes(kata);

                /* Memeriksa kondisi stok sesuai filter yang dipilih */
                var cocokStok =
                    this.filterStok === 'semua' ||
                    (
                        this.filterStok === 'menipis' &&
                        item.qty > 0 &&
                        item.qty < item.safety
                    ) ||
                    (
                        this.filterStok === 'kosong' &&
                        item.qty === 0
                    ) ||
                    (
                        this.filterStok === 'reorder' &&
                        item.qty < item.safety
                    );

                /* Mengembalikan data yang memenuhi seluruh kriteria filter */
                return cocokUPBJJ &&
                    cocokKategori &&
                    cocokKata &&
                    cocokStok;
            }, this);

            /* Menyimpan pilihan pengurutan yang sedang digunakan */
            var sort = this.urutkan;

            /* Mengurutkan hasil filter tanpa mengubah urutan array aslinya */
            return hasil.slice().sort(function (a, b) {

                /* Mengurutkan judul dari A sampai Z */
                if (sort === 'judul-asc') {
                    return a.judul.localeCompare(b.judul);
                }

                /* Mengurutkan stok dari jumlah terkecil */
                if (sort === 'stok-asc') {
                    return a.qty - b.qty;
                }

                /* Mengurutkan stok dari jumlah terbesar */
                if (sort === 'stok-desc') {
                    return b.qty - a.qty;
                }

                /* Mengurutkan harga dari termurah */
                if (sort === 'harga-asc') {
                    return a.harga - b.harga;
                }

                /* Mengurutkan harga dari termahal */
                if (sort === 'harga-desc') {
                    return b.harga - a.harga;
                }

                return 0;
            });
        },

        /* Menghitung jumlah bahan ajar yang stoknya kosong */
        jumlahKosong: function () {
            return this.daftarBahanAjar.filter(function (item) {
                return item.qty === 0;
            }).length;
        },

        /* Menghitung jumlah bahan ajar yang stoknya menipis */
        jumlahMenipis: function () {
            return this.daftarBahanAjar.filter(function (item) {
                return item.qty > 0 && item.qty < item.safety;
            }).length;
        }
    },

    /* WATCH: Memantau perubahan nilai tertentu untuk menjalankan tindakan */
    watch: {

        /* Mengatur ulang filter kategori jika tidak tersedia di UT-Daerah terpilih */
        filterUPBJJ: function () {
            if (
                this.filterKategori &&
                this.kategoriTersedia.indexOf(this.filterKategori) === -1
            ) {
                this.filterKategori = '';
            }
        },

        /* Menampilkan pesan ketika filter stok berubah */
        filterStok: function (nilai) {
            this.pesan = nilai === 'reorder'
                ? 'Menampilkan bahan ajar yang perlu diperiksa untuk pemesanan ulang.'
                : '';
        },

        /* Menampilkan pesan ketika kata kunci pencarian berubah */
        kataKunci: function (nilai) {
            if (nilai.length > 0) {
                this.pesan = 'Daftar diperbarui sesuai kata kunci.';
            }
        }
    },

    /* METHODS: Menyediakan fungsi untuk mengelola data bahan ajar */
    methods: {

        /* Menentukan status stok berdasarkan jumlah dan batas minimum */
        statusStok: function (item) {
            if (item.qty === 0) return 'Kosong';
            if (item.qty < item.safety) return 'Menipis';
            return 'Aman';
        },

        /* Menentukan kelas CSS berdasarkan status stok */
        kelasStatus: function (item) {
            if (item.qty === 0) return 'status-empty';
            if (item.qty < item.safety) return 'status-low';
            return 'status-safe';
        },

        /* Mengubah angka menjadi format mata uang Rupiah */
        formatRupiah: function (angka) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
            }).format(Number(angka) || 0);
        },

        /* Mengembalikan seluruh filter ke nilai awal */
        resetFilter: function () {
            this.filterUPBJJ = '';
            this.filterKategori = '';
            this.filterStok = 'semua';
            this.kataKunci = '';
            this.urutkan = 'judul-asc';
            this.pesan = 'Filter berhasil direset.';

            /* Menampilkan notifikasi bahwa filter berhasil direset */
            tampilkanStockPopup({
                icon: 'success',
                title: 'Filter direset',
                text: 'Semua filter telah dikembalikan ke kondisi awal.',
                timer: 1500,
                showConfirmButton: false
            });
        },

        /* Memeriksa kelengkapan dan validitas data formulir */
        validasiForm: function () {
            var e = [];

            /* Memeriksa apakah kode mata kuliah sudah diisi */
            if (!this.form.kode.trim()) {
                e.push('Kode mata kuliah wajib diisi.');
            }

            /* Memeriksa apakah judul mata kuliah sudah diisi */
            if (!this.form.judul.trim()) {
                e.push('Judul mata kuliah wajib diisi.');
            }

            /* Memeriksa apakah kategori sudah dipilih */
            if (!this.form.kategori) {
                e.push('Kategori wajib dipilih.');
            }

            /* Memeriksa apakah UT-Daerah sudah dipilih */
            if (!this.form.upbjj) {
                e.push('UT-Daerah wajib dipilih.');
            }

            /* Memeriksa apakah lokasi rak sudah diisi */
            if (!this.form.lokasiRak.trim()) {
                e.push('Lokasi rak wajib diisi.');
            }

            /* Memeriksa nilai stok, batas minimum, dan harga */
            ['qty', 'safety', 'harga'].forEach(function (field) {
                var angka = Number(this.form[field]);

                /* Memastikan nilai berupa angka valid dan tidak negatif */
                if (
                    this.form[field] === '' ||
                    !Number.isFinite(angka) ||
                    angka < 0 ||
                    (
                        (field === 'qty' || field === 'safety') &&
                        !Number.isInteger(angka)
                    )
                ) {
                    e.push(
                        field +
                        ' harus berupa angka yang valid dan tidak negatif.'
                    );
                }
            }, this);

            /* Memeriksa agar kode mata kuliah tidak duplikat */
            if (
                this.daftarBahanAjar.some(function (item) {
                    return (
                        item.kode.toLowerCase() ===
                        this.form.kode.trim().toLowerCase() &&
                        (
                            !this.formEdit ||
                            item.kode !== this.formEdit.kode
                        )
                    );
                }, this)
            ) {
                e.push('Kode mata kuliah sudah digunakan.');
            }

            /* Menyimpan daftar kesalahan dan menentukan hasil validasi */
            this.errors = e;
            return e.length === 0;
        },

        /* Menambahkan bahan ajar baru atau menyimpan perubahan data */
        tambahBahanAjar: function () {

            /* Menghentikan proses jika data tidak lolos validasi */
            if (!this.validasiForm()) {
                this.pesan = 'Periksa kembali data yang belum valid.';
                this.jenisPesan = 'error';

                /* Menampilkan daftar kesalahan pada popup */
                tampilkanStockPopup({
                    icon: 'error',
                    title: 'Data belum valid',
                    html: '<ul style="text-align:left">' +
                        this.errors.map(function (error) {
                            return '<li>' + error + '</li>';
                        }).join('') +
                        '</ul>',
                    confirmButtonText: 'Periksa kembali'
                });

                return;
            }

            /* Menyiapkan objek data bahan ajar dari formulir */
            var item = {
                kode: this.form.kode.trim(),
                judul: this.form.judul.trim(),
                kategori: this.form.kategori,
                upbjj: this.form.upbjj,
                lokasiRak: this.form.lokasiRak.trim(),
                qty: Number(this.form.qty),
                safety: Number(this.form.safety),
                harga: Number(this.form.harga),
                catatanHTML: this.form.catatanHTML.trim()
            };

            /* Memperbarui data jika formulir sedang dalam mode edit */
            if (this.formEdit) {
                var index = this.daftarBahanAjar.findIndex(function (row) {
                    return row.kode === this.formEdit.kode;
                }, this);

                /* Memperbarui elemen array secara reaktif pada Vue 2 */
                if (index !== -1) {
                    this.$set(this.daftarBahanAjar, index, item);
                }

                this.pesan = 'Data bahan ajar berhasil diperbarui.';

                /* Menampilkan notifikasi bahwa data berhasil diperbarui */
                tampilkanStockPopup({
                    icon: 'success',
                    title: 'Data diperbarui',
                    text: 'Informasi bahan ajar berhasil diperbarui.',
                    confirmButtonText: 'OK'
                });
            } else {

                /* Menambahkan data baru ke dalam daftar bahan ajar */
                this.daftarBahanAjar.push(item);
                this.pesan = 'Data bahan ajar berhasil ditambahkan.';

                /* Menampilkan notifikasi bahwa data berhasil ditambahkan */
                tampilkanStockPopup({
                    icon: 'success',
                    title: 'Data ditambahkan',
                    text: 'Bahan ajar baru berhasil ditambahkan.',
                    confirmButtonText: 'OK'
                });
            }

            /* Mengatur pesan dan membersihkan formulir setelah penyimpanan */
            this.jenisPesan = 'info';
            this.bersihkanForm();
        },

        /* Mengisi formulir dengan data bahan ajar yang akan diedit */
        mulaiEdit: function (item) {
            this.formEdit = {
                kode: item.kode
            };

            /* Menyalin data ke formulir tanpa mengubah objek awal secara langsung */
            this.form = Object.assign({}, item);
            this.errors = [];
            this.pesan = 'Mode edit: ubah data lalu tekan Simpan Perubahan.';

            /* Mengarahkan tampilan ke bagian bawah halaman tempat formulir berada */
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        },

        /* Mengubah jumlah stok melalui popup SweetAlert2 */
        ubahStokCepat: function (item) {
            var vm = this;

            /* Meminta pengguna memasukkan jumlah stok yang baru */
            tampilkanStockPopup({
                title: 'Ubah jumlah stok',
                text: 'Masukkan jumlah stok baru untuk ' + item.kode,
                input: 'number',
                inputValue: item.qty,
                inputAttributes: {
                    min: 0,
                    step: 1
                },
                showCancelButton: true,
                confirmButtonText: 'Simpan',
                cancelButtonText: 'Batal',

                /* Memvalidasi nilai stok sebelum disimpan */
                inputValidator: function (value) {
                    if (
                        value === '' ||
                        !Number.isInteger(Number(value)) ||
                        Number(value) < 0
                    ) {
                        return 'Stok harus berupa bilangan bulat 0 atau lebih.';
                    }
                }
            }).then(function (result) {

                /* Menghentikan proses jika pengguna membatalkan popup */
                if (!result.isConfirmed) return;

                /* Memperbarui jumlah stok dan pesan informasi */
                item.qty = Number(result.value);
                vm.pesan = 'Jumlah stok berhasil diperbarui.';
                vm.jenisPesan = 'info';

                /* Menampilkan notifikasi bahwa stok berhasil diperbarui */
                tampilkanStockPopup({
                    icon: 'success',
                    title: 'Stok diperbarui',
                    text: item.kode +
                        ' sekarang memiliki stok ' + item.qty + '.',
                    confirmButtonText: 'OK'
                });
            });
        },

        /* Mengosongkan formulir dan mengakhiri mode edit */
        bersihkanForm: function () {
            this.form = {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                qty: 0,
                safety: 0,
                harga: 0,
                catatanHTML: ''
            };

            this.formEdit = null;
            this.errors = [];
        }
    }
});