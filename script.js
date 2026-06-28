const { createClient } = supabase   

const db = createClient(
    'https://frziffueiuosikmhyoae.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyemlmZnVlaXVvc2lrbWh5b2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MTY0MDgsImV4cCI6MjA5NTI5MjQwOH0._G4TlPRL4EUps7qOWudkAcmUcKcPc42Q3kEtm2bQdhA'
  )

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobileMenu');

    const accordionBtns = document.querySelectorAll('.accordion-btn');
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');

            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            } else {
                content.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });

    const addToCartButtons = document.querySelectorAll('button:has(.fa-cart-plus)');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartBadge = document.querySelector('.cart-badge');
            if (cartBadge) {
                cartBadge.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    cartBadge.style.transform = 'scale(1)';
                }, 300);

                const currentCount = parseInt(cartBadge.textContent);
                cartBadge.textContent = currentCount + 1;
            }

            this.innerHTML = '<i class="fas fa-check mr-1"></i> Added';
            this.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            this.classList.add('bg-green-600', 'hover:bg-green-700');

            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-cart-plus"></i> Add';
                this.classList.remove('bg-green-600', 'hover:bg-green-700');
                this.classList.add('bg-blue-600', 'hover:bg-blue-700');
            }, 2000);
        });
    });
});

// CEK LOGIN
if(localStorage.getItem("isLogin") !== "true"){
  window.location.href = "login.html";
}

// AMBIL DATA DARI LOCAL STORAGE
let products = []


async function addProduct(){ 

  const name  = document.getElementById("name").value;
  const stok  = document.getElementById("stok").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("image").value;
  const kategori = document.getElementById("kategori").value;
  const car_type = document.getElementById("edit-car-type-add").value;

  if(name === "" || stok === "" || price === "" || image === "" || kategori === "" || car_type === ""){
    console.log(name, )
    alert("Semua field wajib diisi");
    return;
  }

  const { data, error } = await db
    .from("barang")
  .insert({
    nama_barang: name,
    stok: stok,
    harga: price,
    url_gambar: image,
    kategori: kategori,
    TipeMobil: car_type
})
    .select()
    .single()

  if(error){
    console.log("Error:", error)
    alert("Gagal menambahkan produk")
    return
  }

  products.push(data)

  renderProducts()

  document.getElementById("name").value  = "";
  document.getElementById("stok").value  = "";
  document.getElementById("price").value = "";
  document.getElementById("image").value = "";
  document.getElementById("kategori").value = "";

}// RENDER PRODUK

async function renderProducts(){
    const { data, error } = await db
    .from("barang")
    .select("*")

  if (error) {
    console.log("Error:", error)
    return
  }

  products = data
  const productList =
  document.getElementById("productList");

  productList.innerHTML = "";

  products.forEach((product,index)=>{
    productList.innerHTML += `
    
      <tr>

        <td>
          <img src="${product.url_gambar}">
        </td>

        <td>${product.nama_barang}</td>

        <td>${product.stok}</td>

        <td>
  Rp${product.harga.toLocaleString("id-ID")}

</td>
        <td>${product.kategori || "-"}</td>

        <td>${product.TipeMobil || "-"}</td>
      
        <td>

          <button
          class="edit-btn"
          onclick="editProduct(${index})">

            Edit

          </button>

          <button
          class="delete-btn"
          onclick="deleteProduct(${product.id_barang})">

            Hapus

          </button>

        </td>

      </tr>

    `;

  });

}

// TAMBAH PRODUK

// HAPUS
async function deleteProduct(idBarang){

  if(confirm("Yakin hapus produk?")){

    const { error } = await db
      .from("barang")
      .delete()
      .eq("id_barang", idBarang)

    if(error){
      console.log("Error:", error)
      alert("Gagal menghapus produk")
      return
    }

    products = products.filter(p => p.id_barang !== idBarang)

    renderProducts()

  }

}

// EDIT
let currentEditIndex = null;

function editProduct(index) {
  console.log(index);
  const product = products[index];
  currentEditIndex = index;

  document.getElementById("edit-name").value = product.nama_barang;
  document.getElementById("edit-stok").value = product.stok;
  document.getElementById("edit-price").value = product.harga;
  document.getElementById("edit-image").value = product.url_gambar;
  document.getElementById("edit-category").value = product.kategori;
  document.getElementById("edit-car-type").value = product.TipeMobil || "";

  const modal = document.getElementById("editModal");
  modal.style.display = "flex";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  currentEditIndex = null;
}

async function saveEditProduct() {
  const name = document.getElementById("edit-name").value;
  const stok = document.getElementById("edit-stok").value;
  const price = document.getElementById("edit-price").value;
  const image = document.getElementById("edit-image").value;
  const category = document.getElementById("edit-category").value;
  const car_type = document.getElementById("edit-car-type").value;

  if (name && stok && price && image) {
    const { data, error } = await db
      .from("barang")
      .update({
        nama_barang: name,
        stok: stok,
        harga: price,
        url_gambar: image,
        kategori: category,
        TipeMobil: car_type
      })
      .eq("id_barang", products[currentEditIndex].id_barang);

    if (error) {
      console.error("Gagal update:", error);
      return;
    }

    products.push(data)

    renderProducts();
    closeEditModal();
  }
}
// LOGOUT
function logout(){

  localStorage.removeItem("isLogin");
  localStorage.removeItem("role");

  window.location.href =
  "index.html";

}

renderProducts();
 /* ── Tab switcher ── */
function switchTab(tabName, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tabName).classList.add('active');
  btn.classList.add('active');

  if (tabName === 'user') renderUsers();
  if (tabName === 'transaksi') renderTransaksi();  // ← tambahkan ini
} 
  /* ── Data user (akan diisi dari Supabase) ── */
  let allUsers = [];
 
  async function renderUsers() {
    const tbody = document.getElementById('userList');
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-circle-notch fa-spin"></i> Memuat data user...</div></td></tr>`;
 
    const { data, error } = await db
      .from('User')
      .select('*')
      .order('id_admin', { ascending: false });
 
    if (error) {
      console.error('Gagal memuat user:', error);
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-exclamation-circle"></i><br>Gagal memuat data user.<br><small style="font-size:12px;">${error.message}</small></div></td></tr>`;
      return;
    }
 
    allUsers = data || [];
    updateUserStats(allUsers);
    renderUserRows(allUsers);
  }
 
  function renderUserRows(users) {
    const tbody = document.getElementById('userList');
 
    if (users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-users-slash"></i><br>Tidak ada user ditemukan.</div></td></tr>`;
      return;
    }
 
    tbody.innerHTML = users.map(user => {
      const initials     = getInitials(user.nama_user || '?');
      const isAdmin      = (user.role === 'admin');
      const isSuperAdmin = (user.username === 'admin 1');
 
      const aksiHTML = isSuperAdmin
        ? `<span style="font-size:12px; color:#9ca3af; font-style:italic;">
             <i class="fas fa-lock" style="margin-right:4px;"></i>Super Admin
           </span>`
        : `<div style="display:flex; gap:6px; flex-wrap:wrap;">
             ${isAdmin
               ? `<button class="user-action-btn btn-demote" onclick="changeUserRole(${user.id_admin}, 'user')">Jadikan User</button>`
               : `<button class="user-action-btn btn-promote" onclick="changeUserRole(${user.id_admin}, 'admin')">Jadikan Admin</button>`
             }
             <button class="user-action-btn btn-delete-user" onclick="deleteUser(${user.id_admin})">Hapus</button>
           </div>`;
 
      return `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:10px;">
              <div class="user-avatar" style="${isSuperAdmin ? 'background:#fef3c7; color:#92400e;' : ''}">${initials}</div>
              <span style="font-weight:500;">${user.nama_user || '-'}
                ${isSuperAdmin ? '<i class=\"fas fa-crown\" style=\"color:#f59e0b; font-size:11px; margin-left:4px;\" title=\"Super Admin\"></i>' : ''}
              </span>
            </div>
          </td>
          <td style="color:#6b7280;">${user.username || '-'}</td>
          <td>
            <span class="badge ${isAdmin ? 'badge-admin' : 'badge-user'}">
              ${isAdmin ? 'Admin' : 'User'}
            </span>
          </td>
          <td>
            <span class="status-dot status-active"></span>
            Aktif
          </td>
          <td style="color:#9ca3af; font-size:13px;">ID #${user.id_admin}</td>
          <td>${aksiHTML}</td>
        </tr>
      `;
    }).join('');
  }
 
  function updateUserStats(users) {
    const adminCount   = users.filter(u => u.role === 'admin').length;
    const regularCount = users.length - adminCount;
    document.getElementById('statTotal').textContent   = users.length;
    document.getElementById('statAdmin').textContent   = adminCount;
    document.getElementById('statRegular').textContent = regularCount;
  }
 
  function filterUsers() {
    const q = document.getElementById('userSearchInput').value.toLowerCase();
    const filtered = allUsers.filter(u =>
      (u.nama_user || '').toLowerCase().includes(q) ||
      (u.username  || '').toLowerCase().includes(q)
    );
    renderUserRows(filtered);
  }
 
  function getInitials(str) {
    return str.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || '?';
  }
 
  async function changeUserRole(idAdmin, newRole) {
    // Proteksi superadmin
    const target = allUsers.find(u => u.id_admin === idAdmin);
    if (target && target.id_admin === 1) {
      alert('Role Super Admin tidak dapat diubah.');
      return;
    }
 
    const label = newRole === 'admin' ? 'Admin' : 'User biasa';
    if (!confirm(`Ubah role user ini menjadi ${label}?`)) return;
 
    const { error } = await db
      .from('User')
      .update({ role: newRole })
      .eq('id_admin', idAdmin)
      .select();
 
    if (error) {
      alert('Gagal mengubah role: ' + error.message);
      return;
    }
 
    renderUsers();
  }
 
  async function deleteUser(idAdmin) {
    // Proteksi superadmin
    const target = allUsers.find(u => u.id_admin === idAdmin);
    if (target && target.username === 'admin 1') {
      alert('Akun Super Admin tidak dapat dihapus.');
      return;
    }
 
    if (!confirm('Yakin hapus user ini? Tindakan ini tidak dapat dibatalkan.')) return;
 
    const { error } = await db
      .from('User')
      .delete()
      .eq('id_admin', idAdmin);
 
    if (error) {
      alert('Gagal menghapus user: ' + error.message);
      return;
    }
 
    renderUsers();
  }

  /* ── TRANSAKSI ── */
let allTransaksi = [];

async function renderTransaksi() {
  const tbody = document.getElementById('transaksiList');
  tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-circle-notch fa-spin"></i> Memuat data transaksi...</div></td></tr>`;

  // 1. Ambil pesanan + pelanggan
  const { data: pesananData, error: pesananErr } = await db
    .from('pesanan')
    .select(`
      id_pesanan,
      tanggal,
      total,
      stok,
      pelanggan ( nama_pelanggan )
    `)
    .order('tanggal', { ascending: false });

  if (pesananErr) {
    console.error('Gagal memuat pesanan:', pesananErr);
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-exclamation-circle"></i><br>Gagal memuat data transaksi.<br><small>${pesananErr.message}</small></div></td></tr>`;
    return;
  }

  // 2. Ambil semua detail_pesanan
  const { data: detailData, error: detailErr } = await db
    .from('detail_pesanan')
    .select('id_pesanan, id_barang, jumlah, stok_total');

  if (detailErr) {
    console.error('Gagal memuat detail pesanan:', detailErr);
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-exclamation-circle"></i><br>Gagal memuat detail transaksi.<br><small>${detailErr.message}</small></div></td></tr>`;
    return;
  }

  // 3. Ambil barang berdasarkan id_barang yang ada di detail
  const idBarangList = [...new Set(detailData.map(d => d.id_barang))];
  let barangMap = {};

  if (idBarangList.length > 0) {
    const { data: barangData, error: barangErr } = await db
      .from('barang')
      .select('id_barang, nama_barang')
      .in('id_barang', idBarangList);

    if (!barangErr) {
      barangData.forEach(b => { barangMap[b.id_barang] = b.nama_barang; });
    }
  }

  // 4. Buat lookup map pesanan
  const pesananMap = {};
  (pesananData || []).forEach(p => { pesananMap[p.id_pesanan] = p; });

  // 5. Flatten detail → satu baris per item
  allTransaksi = [];

  if (detailData.length > 0) {
    detailData.forEach(detail => {
      const pesanan = pesananMap[detail.id_pesanan];
      if (!pesanan) return;

      const tanggal = pesanan.tanggal
        ? new Date(pesanan.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
        : '-';

      allTransaksi.push({
        id_pesanan    : pesanan.id_pesanan,
        nama_pelanggan: pesanan.pelanggan?.nama_pelanggan || '-',
        nama_barang   : barangMap[detail.id_barang] || '-',
        jumlah        : detail.jumlah,
        total_harga   : pesanan.total,
        tanggal       : tanggal
      });
    });
  } else {
    // Fallback jika detail_pesanan masih kosong
    (pesananData || []).forEach(pesanan => {
      const tanggal = pesanan.tanggal
        ? new Date(pesanan.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
        : '-';

      allTransaksi.push({
        id_pesanan    : pesanan.id_pesanan,
        nama_pelanggan: pesanan.pelanggan?.nama_pelanggan || '-',
        nama_barang   : '-',
        jumlah        : pesanan.stok ?? '-',
        total_harga   : pesanan.total,
        tanggal       : tanggal
      });
    });
  }

  updateTransaksiStats(allTransaksi);
  renderTransaksiRows(allTransaksi);
}

function renderTransaksiRows(rows) {
  const tbody = document.getElementById('transaksiList');

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-inbox"></i><br>Tidak ada data transaksi.</div></td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map((row, i) => `
    <tr>
      <td style="color:#9ca3af; font-size:13px;">${i + 1}</td>
      <td style="font-weight:500;">${row.nama_pelanggan}</td>
      <td>${row.nama_barang}</td>
      <td style="text-align:center;">${row.jumlah}</td>
      <td style="color:#059669; font-weight:600;">Rp${Number(row.total_harga).toLocaleString('id-ID')}</td>
      <td style="color:#9ca3af; font-size:13px;">${row.tanggal}</td>
    </tr>
  `).join('');
}

function updateTransaksiStats(rows) {
  // Hitung unik berdasarkan id_pesanan agar total pendapatan tidak dobel
  const uniquePesanan = [...new Map(rows.map(r => [r.id_pesanan, r])).values()];
  const totalPendapatan = uniquePesanan.reduce((sum, r) => sum + Number(r.total_harga), 0);

  document.getElementById('statTotalTrx').textContent = uniquePesanan.length;
  document.getElementById('statTotalPendapatan').textContent = 'Rp' + totalPendapatan.toLocaleString('id-ID');
}

function filterTransaksi() {
  const q = document.getElementById('transaksiSearchInput').value.toLowerCase();
  const filtered = allTransaksi.filter(r =>
    r.nama_pelanggan.toLowerCase().includes(q) ||
    r.nama_barang.toLowerCase().includes(q)
  );
  renderTransaksiRows(filtered);
}