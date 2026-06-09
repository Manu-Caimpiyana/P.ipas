const transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
const produk = JSON.parse(localStorage.getItem("produk")) || [];

function loadAnalitik() {
    if (transaksi.length === 0) return;

    let totalOmset = transaksi.reduce((a, b) => a + b.total, 0);
    let totalTerjual = transaksi.reduce((a, b) => a + b.jumlah, 0);
    let rataRata = totalOmset / transaksi.length;

    document.getElementById("analitikOmset").innerText = "Rp " + totalOmset.toLocaleString();
    document.getElementById("analitikTerjual").innerText = totalTerjual + " pcs";
    document.getElementById("analitikRerata").innerText = "Rp " + Math.round(rataRata).toLocaleString();

    // --- LOGIC AGREGASI DATA UNTUK GRAFIK PROKDUK TERLARIS ---
    // Ngumpulin jumlah terjual per nama produk
    let produkTerlaris = {};
    transaksi.forEach(item => {
        produkTerlaris[item.nama] = (produkTerlaris[item.nama] || 0) + item.jumlah;
    });

    // Sortir object biar dapet data nama produk dan jumlahnya
    let labelProduk = Object.keys(produkTerlaris);
    let dataProduk = Object.values(produkTerlaris);


    // --- LOGIC AGREGASI DATA UNTUK GRAFIK KATEGORI ---
    // Karena di transaksi gak ada data kategori, kita mapping/cocokin dari data produk asli
    let pendapatanKategori = {};
    transaksi.forEach(item => {
        // Cari produk asli di array produk buat tau kategorinya
        const produkAsli = produk.find(p => p.nama === item.nama);
        const kategori = produkAsli ? produkAsli.kategori : "Lainnya";
        
        pendapatanKategori[kategori] = (pendapatanKategori[kategori] || 0) + item.total;
    });

    let labelKategori = Object.keys(pendapatanKategori);
    let dataKategori = Object.values(pendapatanKategori);


    // --- RENDER GRAFIK 1: PRODUK TERLARIS (BAR CHART) ---
    const ctxProduk = document.getElementById('chartProduk').getContext('2d');
    new Chart(ctxProduk, {
        type: 'bar',
        data: {
            labels: labelProduk,
            datasets: [{
                label: 'Jumlah Terjual (Pcs)',
                data: dataProduk,
                backgroundColor: '#4e73df', // Warna biru mentereng
                borderColor: '#4e73df',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Biar ukurannya manut sama CSS dan gak molor ke bawah
            scales: { 
                y: { beginAtZero: true } 
            }
        }
    });

    // --- RENDER GRAFIK 2: PENDAPATAN KATEGORI (BAR CHART JUGA) ---
    const ctxKategori = document.getElementById('chartKategori').getContext('2d');
    new Chart(ctxKategori, {
        type: 'bar', // DI SINI UDAH BERUBAH JADI BAR
        data: {
            labels: labelKategori,
            datasets: [{
                label: 'Total Pendapatan (Rp)',
                data: dataKategori,
                backgroundColor: '#1cc88a', // Gua ganti warna ijo duit biar beda sama produk
                borderColor: '#1cc88a',
                borderWidth: 1
            }]
        },
        options: { 
            responsive: true,
            maintainAspectRatio: false, // Ngunci tinggi chart
            scales: { 
                y: { beginAtZero: true } 
            }
        }
    });

    // --- GENERATE REKOMENDASI OTOMATIS ---
    generateRekomendasi(produkTerlaris, labelKategori);
}

// Fungsi pendukung untuk bikin teks analisis otomatis ala P.IPAS
function generateRekomendasi(produkTerlaris, listKategori) {
    if (Object.keys(produkTerlaris).length === 0) return;
    
    // Cari produk dengan penjualan paling tinggi
    let topProduk = Object.keys(produkTerlaris).reduce((a, b) => produkTerlaris[a] > produkTerlaris[b] ? a : b);
    
    let teks = `Berdasarkan data sosiologi ekonomi konsumen toko lu, produk <strong>${topProduk}</strong> merupakan komoditas yang paling diminati pasar saat ini. Rekomendasi tindakan efisiensi lingkungan dan modal: Sebaiknya fokuskan alokasi dana <i>restock</i> pada kategori <strong>${listKategori[0] || 'Utama'}</strong> untuk menghindari penumpukan barang mati (<i>dead stock</i>) yang berisiko menjadi limbah komersial.`;
    
    document.getElementById("teksRekomendasi").innerHTML = teks;
}

// Jalankan fungsi pas halaman di-load
window.onload = loadAnalitik;
