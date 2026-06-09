
    let produk = JSON.parse(localStorage.getItem("produk")) || [];
    let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];


    function renderProduk(){

        const table = document.getElementById("produkTable");
        const select = document.getElementById("pilihProduk");

        table.innerHTML = "";
        select.innerHTML = "";

        produk.forEach((item,index)=>{

            table.innerHTML += `
                <tr>
                    <td>${item.nama}</td>
                    <td>Rp ${item.harga}</td>
                    <td style="color: ${item.stok < 10 ? 'red' : 'inherit'}; font-weight: ${item.stok < 10 ? 'bold' : 'normal'};">
                        ${item.stok}
                    </td>
                    <td>${item.kategori}</td>

                    <td>
                        <button class="btn-warning" onclick="editProduk(${index})">
                            Edit
                        </button>

                        <button class="btn-danger" onclick="hapusProduk(${index})">
                            Hapus
                        </button>
                    </td>
                </tr>
            `;

            select.innerHTML += `
                <option value="${index}">
                    ${item.nama}
                </option>
            `;
        });

        updateDashboard();
    }


    function simpanProduk(){

        const id = document.getElementById("produkId").value;
        const nama = document.getElementById("nama").value;
        const harga = document.getElementById("harga").value;
        const stok = document.getElementById("stok").value;
        const kategori = document.getElementById("kategori").value;

        // VALIDASI INPUT
        if(nama === "" || harga === "" || stok === "" || kategori === ""){
            alert("Isi semua data dulu!");
            return;
        }

        const data = {
            nama,
            harga:Number(harga),
            stok:Number(stok),
            kategori
        };

        // MODE EDIT
        if(id !== ""){
            produk[id] = data;
        }else{
            produk.push(data);
        }

        localStorage.setItem("produk",JSON.stringify(produk));

        resetForm();
        renderProduk();
    }

    function editProduk(index){

        const item = produk[index];

        document.getElementById("produkId").value = index;
        document.getElementById("nama").value = item.nama;
        document.getElementById("harga").value = item.harga;
        document.getElementById("stok").value = item.stok;
        document.getElementById("kategori").value = item.kategori;
    }

    function hapusProduk(index){

        if(confirm("Yakin mau hapus produk?")){
            produk.splice(index,1);

            localStorage.setItem("produk",JSON.stringify(produk));

            renderProduk();
        }
    }

    function resetForm(){

        document.getElementById("produkId").value = "";
        document.getElementById("nama").value = "";
        document.getElementById("harga").value = "";
        document.getElementById("stok").value = "";
        document.getElementById("kategori").value = "";
    }

    document.getElementById("jumlahBeli")
    .addEventListener("input", hitungTotal);

    document.getElementById("pilihProduk")
    .addEventListener("change", hitungTotal);

    function hitungTotal(){

        const index = document.getElementById("pilihProduk").value;
        const jumlah = document.getElementById("jumlahBeli").value;

        if(produk[index]){

            const total = produk[index].harga * jumlah;

            document.getElementById("totalHarga")
            .innerText = "Rp " + total.toLocaleString();
        }
    }

    function tambahTransaksi(){

        const index = document.getElementById("pilihProduk").value;
        const jumlah = Number(document.getElementById("jumlahBeli").value);

        if(!produk[index]){
            alert("Produk belum ada.");
            return;
        }

        if(jumlah <= 0){
            alert("Jumlah beli salah.");
            return;
        }

        if(jumlah > produk[index].stok){
            alert("Stok tidak cukup.");
            return;
        }

        const total = produk[index].harga * jumlah;

        transaksi.push({
            nama: produk[index].nama,
            jumlah,
            total
        });

        // Kurangi stok
        produk[index].stok -= jumlah;

        localStorage.setItem("produk",JSON.stringify(produk));
        localStorage.setItem("transaksi",JSON.stringify(transaksi));

        document.getElementById("jumlahBeli").value = "";

        renderProduk();
        renderTransaksi();
    }

    function renderTransaksi(){

        const table = document.getElementById("transaksiTable");

        table.innerHTML = "";

        transaksi.forEach((item)=>{

            table.innerHTML += `
                <tr>
                    <td>${item.nama}</td>
                    <td>${item.jumlah}</td>
                    <td>Rp ${item.total.toLocaleString()}</td>
                </tr>
            `;
        });

        updateDashboard();
    }

    function updateDashboard(){

        document.getElementById("totalProduk")
        .innerText = produk.length;

        document.getElementById("totalTransaksi")
        .innerText = transaksi.length;

        let totalPendapatan = transaksi.reduce((a,b)=>a+b.total,0);

        document.getElementById("totalPendapatan")
        .innerText = "Rp " + totalPendapatan.toLocaleString();
    }

    function hapusSemuaTransaksi() {
    // 1. Kasih konfirmasi dulu biar gak gak sengaja kepencet
        if (confirm("Apakah Anda yakin ingin menghapus semua riwayat transaksi?")) {
            
            // 2. Kosongkan array transaksi
            transaksi = [];

            // 3. Update data transaksi di localStorage jadi array kosong
            localStorage.setItem("transaksi", JSON.stringify(transaksi));

            // 4. Render ulang tabel transaksi dan dashboard biar langsung berubah di layar
            renderTransaksi();
            
            alert("Riwayat transaksi berhasil dibersihkan!");
        }
    }

    renderProduk();
    renderTransaksi();