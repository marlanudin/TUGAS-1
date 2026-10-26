// LOGIN PAGE

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email =
            document.getElementById('email').value.trim();
        const password =
            document.getElementById('password').value.trim();

        // Cari user dari dataPengguna

        const user = dataPengguna.find(
            (u) =>
                u.email === email &&
                u.password === password
        );

        // Jika Login Berhasil

        if (user) {

            // Simpan nama user
            localStorage.setItem(
                'namaUser',
                user.nama
            );

            // Simpan status login
            localStorage.setItem(
                'isLogin',
                'true'
            );

            Swal.fire({
                title: 'Login Berhasil!',
                text:
                    `Selamat datang, ${user.nama}!`,
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f5d216',
                customClass: {
                    popup: 'login-popup',
                    title: 'login-title',
                    htmlContainer: 'login-text',
                    confirmButton: 'login-confirm'
                },

                buttonsStyling: true

            }).then(() => {

                window.location.href =
                    'dashboard.html';
            });
        }

        // Jika Login Gagal

        else {
            Swal.fire({
                title: 'Login Gagal!',
                text:
                    'Email atau password salah. Silakan coba lagi.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f5d216',
                customClass: {
                    popup: 'login-popup',
                    title: 'login-title',
                    htmlContainer: 'login-text',
                    confirmButton: 'login-confirm'
                }
            });
        }
    });
}

// Fitur tampil dan Sembunyikan Password

function showHide() {
    const input =
        document.getElementById("password");
    const icon =
        document.querySelector(".eye-icon i");

    // Jika elemen tidak ada,
    // jangan jalankan fungsi
    if (!input || !icon) {
        return;
    }

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }

    else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

// Fitur Lupa Password

const forgetLink =
    document.getElementById('forgetLink');
if (forgetLink) {
    forgetLink.addEventListener(
        'click',
        function (e) {
            e.preventDefault();

            Swal.fire({
                title: 'Lupa Password?',
                text:
                    'Silakan hubungi admin UT untuk reset password',
                icon: 'info',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f5d216',

                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-popup-title',
                    htmlContainer: 'custom-popup-text',
                    confirmButton: 'custom-popup-button'
                }
            });
        }
    );
}

// Fitur Daftar Akun

const registerLink =
    document.getElementById('registerLink');
if (registerLink) {
    registerLink.addEventListener(
        'click',
        function (e) {
            e.preventDefault();

            Swal.fire({
                title: 'Belum Punya Akun?',
                text:
                    'Silakan hubungi admin UT untuk mendapatkan akses akun',
                icon: 'info',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f5d216',
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-popup-title',
                    htmlContainer: 'custom-popup-text',
                    confirmButton: 'custom-popup-button'
                }
            });
        }
    );
}


// DASHBOARD PAGE

// Navbar

document.addEventListener(
    "click",
    function (event) {
        const navbar =
            document.querySelector(".navbar");
        const navmenu =
            document.getElementById("navmenu");
        const toggler =
            document.querySelector(".navbar-toggler");

        // Jika navbar/navmenu tidak ada,
        // hentikan fungsi.
        if (!navbar || !navmenu) {
            return;
        }

        // Fitur Klik di luar navbar

        if (
            navmenu.classList.contains("show") &&
            !navbar.contains(event.target)
        ) {
            if (
                typeof bootstrap !== "undefined" &&
                bootstrap.Collapse
            ) {
                const bsCollapse =
                    bootstrap.Collapse.getInstance(navmenu);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        }
    }
);

// Fitur tutup saat dropdown diklik

const dropdownItems =
    document.querySelectorAll(
        "#navmenu .dropdown-item"
    );

dropdownItems.forEach(function (item) {
    item.addEventListener(
        "click",
        function () {
            const navmenu =
                document.getElementById("navmenu");

            if (!navmenu) {
                return;
            }

            if (
                typeof bootstrap !== "undefined" &&
                bootstrap.Collapse
            ) {
                const bsCollapse =
                    bootstrap.Collapse.getInstance(navmenu);

                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        }
    );
});

// Tombol Logout

const logoutBtn =
    document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener(
        'click',
        function () {

            Swal.fire({
                title: 'Logout?',
                text:
                    'Apakah Anda yakin ingin keluar dari akun?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Logout',
                cancelButtonText: 'Batal',
                customClass: {
                    popup: 'logout-popup',
                    title: 'logout-title',
                    htmlContainer: 'logout-text',
                    confirmButton: 'logout-confirm',
                    cancelButton: 'logout-cancel'
                },

                buttonsStyling: false

            }).then((result) => {
                if (result.isConfirmed) {

                    // Hapus data login
                    localStorage.removeItem(
                        'namaUser'
                    );

                    localStorage.removeItem(
                        'isLogin'
                    );

                    // Kembali ke login
                    window.location.href =
                        'login.html';
                }
            });
        }
    );
}

// Fitur Greeting

const greeting = document.getElementById("greeting");
if (greeting) {

    const namaUser = localStorage.getItem("namaUser");
    const hour = new Date().getHours();
    let timeOfDay;
    if (hour < 11) {
        timeOfDay = "Selamat Pagi";
    }
    else if (hour < 15) {
        timeOfDay = "Selamat Siang";
    }
    else if (hour < 19) {
        timeOfDay = "Selamat Sore";
    }
    else {
        timeOfDay = "Selamat Malam";
    }

    // Tampilkan waktu
    document.getElementById("timeOfDay").textContent = timeOfDay;

    // Tampilkan nama jika tersedia
    if (namaUser) {
        document.getElementById("namaUser").textContent = `${namaUser}!`;
    } else {
        document.getElementById("namaUser").textContent = "";
    }
}


// TRACKING PAGE

document.addEventListener("DOMContentLoaded", function () {

    const findBtn = document.getElementById("findBtn");
    const inputDO = document.getElementById("inputDO");
    const resultContainer = document.getElementById("trackingResult");

    // Elemen data
    const trackingStatus = document.getElementById("trackingStatus");
    const nomorDO = document.getElementById("nomorDO");
    const nama = document.getElementById("nama");
    const ekspedisi = document.getElementById("ekspedisi");
    const tanggalKirim = document.getElementById("tanggalKirim");
    const paket = document.getElementById("paket");
    const total = document.getElementById("total");
    const timeline = document.getElementById("timeline");

    // Hanya jalankan di tracking.html
    if (!findBtn || !inputDO || !resultContainer) {
        return;
    }

    // Sembunyikan hasil saat awal
    resultContainer.style.display = "none";

    // Tombol cari
    findBtn.addEventListener("click", function () {

        const doNumber = inputDO.value.trim();

        // Jika nomor DO kosong
        if (!doNumber) {

            resultContainer.style.display = "none";

            Swal.fire({
                title: "Nomor DO Kosong",
                text: "Masukkan Nomor DO terlebih dahulu",
                icon: "warning",
                confirmButtonText: "OK",

                customClass: {
                    popup: "custom-swal-popup",
                    title: "custom-swal-title",
                    htmlContainer: "custom-swal-text",
                    confirmButton: "custom-swal-button"
                },

                buttonsStyling: false
            });

            return;
        }

        // Cari Data
        const data = dataTracking[doNumber];

        // Jika data tidak ditemukan
        if (!data) {

            resultContainer.style.display = "none";

            Swal.fire({
                title: "Data Tidak Ditemukan",
                text: `Nomor DO ${doNumber} tidak tersedia dalam sistem`,
                icon: "error",
                confirmButtonText: "OK",

                customClass: {
                    popup: "custom-swal-popup",
                    title: "custom-swal-title",
                    htmlContainer: "custom-swal-text",
                    confirmButton: "custom-swal-button"
                },

                buttonsStyling: false
            });

            return;
        }

        // Tampilkan hasil
        resultContainer.style.display = "block";

        // Masukan data
        trackingStatus.textContent = data.status;
        nomorDO.textContent = data.nomorDO;
        nama.textContent = data.nama;
        ekspedisi.textContent = data.ekspedisi;
        tanggalKirim.textContent = data.tanggalKirim;
        paket.textContent = data.paket;
        total.textContent = data.total;

        // Buat timeline
        timeline.innerHTML = "";
        data.perjalanan.forEach(function (item, index) {

            const isLast =
                index === data.perjalanan.length - 1;

            const timelineItem = document.createElement("div");
            timelineItem.className = `timeline-item ${isLast ? "active" : ""}`;

            timelineItem.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-time">
                        <i class="bi bi-calendar3"></i>
                        ${item.waktu}
                    </div>
                    <div class="timeline-description">
                        ${item.keterangan}
                </div>
                </div>
            `;

            timeline.appendChild(timelineItem);
        });
    });
});


// STOCK PAGE

const stokTableBody = document.getElementById("stokTableBody");
const formTambah = document.getElementById("formTambah");

if (stokTableBody && formTambah) {

    // Tampilkan Data Stock
    function tampilkanStok() {
        stokTableBody.innerHTML = "";

        dataBahanAjar.forEach(item => {
            stokTableBody.innerHTML += `
                <tr>
                    <td>
                        <img src="${item.cover}" alt="${item.namaBarang}">
                    </td>
                    <td>${item.kodeLokasi}</td>
                    <td>${item.kodeBarang}</td>
                    <td>${item.namaBarang}</td>
                    <td>${item.jenisBarang}</td>
                    <td>${item.edisi}</td>
                    <td>${item.stok}</td>
                </tr>
            `;
        });
    }

    // Tampilkan data saat halaman dibuka
    tampilkanStok();

// Form Tambah Stock
    formTambah.addEventListener("submit", function (e) {
        e.preventDefault();

        // Ambil data dari form
        const kodeLokasi =
            document.getElementById("kodeLokasi").value.trim();

        const kodeBahanAjar =
            document.getElementById("kodeBahanAjar").value.trim();

        const nama =
            document.getElementById("nama").value.trim();

        const jenis =
            document.getElementById("jenis").value.trim();

        const stok =
            Number(document.getElementById("stok").value);

        const edisi =
            document.getElementById("edisi").value.trim();

        const coverInput =
            document.getElementById("cover");

        const file =
            coverInput.files[0];

        // Cek input
        if (!kodeLokasi || !kodeBahanAjar || !nama || !edisi || isNaN(stok)) {

            Swal.fire({
                title: "Data Belum Lengkap",
                text: "Silakan lengkapi semua data terlebih dahulu",
                icon: "warning",
                confirmButtonText: "OK",

                customClass: {
                    popup: "custom-swal-popup",
                    title: "custom-swal-title",
                    htmlContainer: "custom-swal-text",
                    confirmButton: "custom-swal-button"
                },

                buttonsStyling: false
            });

            return;
        }

        // Cek file cover
        if (!file) {

            Swal.fire({
                title: "Sampul Belum Dipilih",
                text: "Silakan pilih gambar sampul terlebih dahulu",
                icon: "warning",
                confirmButtonText: "OK",

                customClass: {
                    popup: "custom-swal-popup",
                    title: "custom-swal-title",
                    htmlContainer: "custom-swal-text",
                    confirmButton: "custom-swal-button"
                },

                buttonsStyling: false
            });

            return;
        }

        // Cek format file
        const formatValid = [
            "image/jpeg",
            "image/png"
        ];

        if (!formatValid.includes(file.type)) {

            Swal.fire({
                title: "Format Tidak Valid",
                text: "Gambar sampul harus berupa JPG atau PNG",
                icon: "error",
                confirmButtonText: "OK",

                customClass: {
                    popup: "custom-swal-popup",
                    title: "custom-swal-title",
                    htmlContainer: "custom-swal-text",
                    confirmButton: "custom-swal-button"
                },

                buttonsStyling: false
            });

            return;
        }

        // Baca gambar
        const reader = new FileReader();
        reader.onload = function (event) {

            // Data baru
            const dataBaru = {
                cover: event.target.result,
                kodeLokasi: kodeLokasi,
                kodeBarang: kodeBahanAjar,
                namaBarang: nama,
                jenisBarang: jenis,
                edisi: edisi,
                stok: stok
            };

            // Tambahkan Data
            dataBahanAjar.push(dataBaru);
            
            // Perbarui tabel
            tampilkanStok();

            // Reset form
            formTambah.reset();

            // Pop up Berhasil
            Swal.fire({
                title: "Berhasil!",
                text: `${nama} berhasil ditambahkan ke data stok`,
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    popup: "custom-swal-popup",
                    title: "custom-swal-title",
                    htmlContainer: "custom-swal-text",
                    confirmButton: "custom-swal-button"
                },
                buttonsStyling: false
            });
        };
        reader.readAsDataURL(file);
    });

}

// FITUR NAVBAR UBAH WARNA SAAT MENU AKTIF

document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    if (!navbar) {
        return;
    }

    // Ambil nama halaman sekarang
    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    // Ambil semua menu navbar
    const navLinks = navbar.querySelectorAll(
        ".navbar-nav .nav-link:not(.dropdown-toggle)"
    );

    navLinks.forEach(function (link) {
        const href = link.getAttribute("href");
        if (!href || href === "#") {
            return;
        }

        const linkPage =
            href
                .split("/")
                .pop()
                .toLowerCase();

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });

});


// FITUR TRANSISI SMOOTH SAAT PINDAH PAGE

document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelectorAll(
        ".navbar-nav .nav-link:not(.dropdown-toggle)"
    );

    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const href = link.getAttribute("href");

            // Abaikan link kosong atau #
            if (!href || href === "#") {
                return;
            }

            // Abaikan jika link adalah halaman yang sedang dibuka
            const currentPage =
                window.location.pathname.split("/").pop();

            const linkPage =
                href.split("/").pop();

            if (currentPage === linkPage) {
                return;
            }

            // Hentikan perpindahan langsung
            event.preventDefault();

            // Efek keluar
            document.body.classList.add("page-exit");

            // Pindah setelah animasi selesai
            setTimeout(function () {
                window.location.href = href;
            }, 300);

        });

    });

});