// LOGIN PAGE

// Mengambil elemen formulir login dari halaman
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    // Menjalankan proses login ketika formulir dikirim
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Mengambil email dan password dari input
        const email =
            document.getElementById('email').value.trim();

        const password =
            document.getElementById('password').value.trim();

        // Mencari pengguna yang sesuai dengan email dan password
        const user = dataPengguna.find(
            (u) =>
                u.email === email &&
                u.password === password
        );

        // Memproses login jika data pengguna cocok
        if (user) {

            // Menyimpan nama pengguna ke localStorage
            localStorage.setItem(
                'namaUser',
                user.nama
            );

            // Menyimpan status login ke localStorage
            localStorage.setItem(
                'isLogin',
                'true'
            );

            // Menampilkan notifikasi login berhasil
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

                // Mengarahkan pengguna ke halaman dashboard
                window.location.href =
                    'dashboard.html';
            });
        }

        // Memproses login jika data pengguna tidak cocok
        else {
            // Menampilkan notifikasi login gagal
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

// FITUR TAMPIL DAN SEMBUNYIKAN PASSWORD

// Mengubah tipe input password agar teks dapat ditampilkan atau disembunyikan
function showHide() {
    const input =
        document.getElementById("password");

    const icon =
        document.querySelector(".eye-icon i");

    // Menghentikan fungsi jika elemen tidak ditemukan
    if (!input || !icon) {
        return;
    }

    // Menampilkan password jika sebelumnya tersembunyi
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }

    // Menyembunyikan password jika sebelumnya terlihat
    else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

// FITUR LUPA PASSWORD

// Mengambil elemen tautan lupa password
const forgetLink =
    document.getElementById('forgetLink');

if (forgetLink) {
    // Menampilkan informasi ketika tautan diklik
    forgetLink.addEventListener(
        'click',
        function (e) {
            e.preventDefault();

            // Menampilkan petunjuk untuk menghubungi admin UT
            Swal.fire({
                title: 'Lupa Password?',
                text:
                    'Silakan hubungi admin UT untuk reset password',
                icon: 'info',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f5d216',

                // Mengatur kelas CSS khusus popup
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

// FITUR DAFTAR AKUN

// Mengambil elemen tautan pendaftaran akun
const registerLink =
    document.getElementById('registerLink');

if (registerLink) {
    // Menampilkan informasi ketika tautan pendaftaran diklik
    registerLink.addEventListener(
        'click',
        function (e) {
            e.preventDefault();

            // Menampilkan petunjuk untuk menghubungi admin UT
            Swal.fire({
                title: 'Belum Punya Akun?',
                text:
                    'Silakan hubungi admin UT untuk mendapatkan akses akun',
                icon: 'info',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f5d216',

                // Mengatur kelas CSS khusus popup
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

// FITUR NAVBAR

// Menangani klik pada area halaman untuk menutup menu navbar mobile
document.addEventListener(
    "click",
    function (event) {
        const navbar =
            document.querySelector(".navbar");

        const navmenu =
            document.getElementById("navmenu");

        const toggler =
            document.querySelector(".navbar-toggler");

        // Menghentikan fungsi jika navbar atau menu tidak ditemukan
        if (!navbar || !navmenu) {
            return;
        }

        // Menutup navbar jika pengguna mengeklik area di luar navbar
        if (
            navmenu.classList.contains("show") &&
            !navbar.contains(event.target)
        ) {
            // Memeriksa ketersediaan komponen Collapse Bootstrap
            if (
                typeof bootstrap !== "undefined" &&
                bootstrap.Collapse
            ) {
                const bsCollapse =
                    bootstrap.Collapse.getInstance(navmenu);

                // Menutup menu jika instance Collapse tersedia
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        }
    }
);

// FITUR MENUTUP NAVBAR SAAT DROPDOWN DIKLIK

// Mengambil seluruh item dropdown pada navbar
const dropdownItems =
    document.querySelectorAll(
        "#navmenu .dropdown-item"
    );

// Menambahkan event klik pada setiap item dropdown
dropdownItems.forEach(function (item) {
    item.addEventListener(
        "click",
        function () {
            const navmenu =
                document.getElementById("navmenu");

            // Menghentikan fungsi jika menu navbar tidak ditemukan
            if (!navmenu) {
                return;
            }

            // Memeriksa ketersediaan komponen Collapse Bootstrap
            if (
                typeof bootstrap !== "undefined" &&
                bootstrap.Collapse
            ) {
                const bsCollapse =
                    bootstrap.Collapse.getInstance(navmenu);

                // Menutup navbar jika instance Collapse tersedia
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        }
    );
});

// FITUR LOGOUT

// Mengambil elemen tombol logout
const logoutBtn =
    document.getElementById('logoutBtn');

if (logoutBtn) {
    // Menjalankan proses konfirmasi ketika tombol logout diklik
    logoutBtn.addEventListener(
        'click',
        function () {

            // Menampilkan konfirmasi sebelum keluar dari akun
            Swal.fire({
                title: 'Logout?',
                text:
                    'Apakah Anda yakin ingin keluar dari akun?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Logout',
                cancelButtonText: 'Batal',

                // Mengatur kelas CSS khusus popup logout
                customClass: {
                    popup: 'logout-popup',
                    title: 'logout-title',
                    htmlContainer: 'logout-text',
                    confirmButton: 'logout-confirm',
                    cancelButton: 'logout-cancel'
                },

                buttonsStyling: false

            }).then((result) => {

                // Menjalankan logout jika pengguna mengonfirmasi
                if (result.isConfirmed) {

                    // Menghapus nama pengguna dari localStorage
                    localStorage.removeItem(
                        'namaUser'
                    );

                    // Menghapus status login dari localStorage
                    localStorage.removeItem(
                        'isLogin'
                    );

                    // Mengarahkan pengguna kembali ke halaman login
                    window.location.href =
                        'login.html';
                }
            });
        }
    );
}

// FITUR GREETING

// Mengambil elemen sapaan pada halaman dashboard
const greeting = document.getElementById("greeting");

if (greeting) {

    // Mengambil nama pengguna yang tersimpan
    const namaUser = localStorage.getItem("namaUser");

    // Mengambil jam saat ini berdasarkan waktu perangkat
    const hour = new Date().getHours();

    // Menentukan variabel untuk sapaan berdasarkan waktu
    let timeOfDay;

    // Menentukan sapaan untuk pagi hari
    if (hour < 11) {
        timeOfDay = "Selamat Pagi";
    }

    // Menentukan sapaan untuk siang hari
    else if (hour < 15) {
        timeOfDay = "Selamat Siang";
    }

    // Menentukan sapaan untuk sore hari
    else if (hour < 19) {
        timeOfDay = "Selamat Sore";
    }

    // Menentukan sapaan untuk malam hari
    else {
        timeOfDay = "Selamat Malam";
    }

    // Menampilkan sapaan sesuai waktu
    document.getElementById("timeOfDay").textContent = timeOfDay;

    // Menampilkan nama pengguna jika tersedia
    if (namaUser) {
        document.getElementById("namaUser").textContent = `${namaUser}!`;
    } else {
        // Mengosongkan bagian nama jika data tidak tersedia
        document.getElementById("namaUser").textContent = "";
    }
}

// FITUR NAVBAR BERUBAH WARNA SAAT MENU AKTIF

// Menjalankan kode setelah struktur HTML selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");

    // Menghentikan fungsi jika navbar tidak ditemukan
    if (!navbar) {
        return;
    }

    // Mengambil nama halaman yang sedang dibuka
    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    // Mengambil semua tautan navbar selain tombol dropdown
    const navLinks = navbar.querySelectorAll(
        ".navbar-nav .nav-link:not(.dropdown-toggle)"
    );

    // Memeriksa setiap tautan untuk menentukan halaman aktif
    navLinks.forEach(function (link) {
        const href = link.getAttribute("href");

        // Melewati tautan kosong atau tautan #
        if (!href || href === "#") {
            return;
        }

        // Mengambil nama halaman dari atribut href
        const linkPage =
            href
                .split("/")
                .pop()
                .toLowerCase();

        // Menambahkan kelas active jika halaman sesuai
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });

});

// FITUR TRANSISI SMOOTH SAAT PINDAH HALAMAN

// Menjalankan kode setelah struktur HTML selesai dimuat
document.addEventListener("DOMContentLoaded", function () {

    // Mengambil semua tautan navbar selain tombol dropdown
    const navLinks = document.querySelectorAll(
        ".navbar-nav .nav-link:not(.dropdown-toggle)"
    );

    // Menambahkan efek transisi pada setiap tautan navbar
    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const href = link.getAttribute("href");

            // Mengabaikan tautan kosong atau tautan #
            if (!href || href === "#") {
                return;
            }

            // Mengambil nama halaman yang sedang dibuka
            const currentPage =
                window.location.pathname.split("/").pop();

            // Mengambil nama halaman tujuan
            const linkPage =
                href.split("/").pop();

            // Mengabaikan tautan menuju halaman yang sama
            if (currentPage === linkPage) {
                return;
            }

            // Mencegah perpindahan halaman secara langsung
            event.preventDefault();

            // Menambahkan kelas untuk menjalankan efek halaman keluar
            document.body.classList.add("page-exit");

            // Mengarahkan pengguna setelah jeda animasi 300 milidetik
            setTimeout(function () {
                window.location.href = href;
            }, 300);

        });
    });

});