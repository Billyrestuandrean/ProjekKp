const { createClient } = supabase

const db = createClient(
    'https://frziffueiuosikmhyoae.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyemlmZnVlaXVvc2lrbWh5b2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MTY0MDgsImV4cCI6MjA5NTI5MjQwOH0._G4TlPRL4EUps7qOWudkAcmUcKcPc42Q3kEtm2bQdhA'
  )

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenuButton = document.querySelector('header button.md\:hidden');

    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.remove('hidden');
    });

    closeMobileMenu.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
    });

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
  const part  = document.getElementById("part").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("image").value;
  const kategori = document.getElementById("kategori").value;

  if(name === "" || part === "" || price === "" || image === "" || kategori === ""){
    alert("Semua field wajib diisi");
    return;
  }

  const { data, error } = await db
    .from("barang")
  .insert({
    nama_barang: name,
    part: part,
    harga: price,
    url_gambar: image,
    kategori: kategori,
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
  document.getElementById("part").value  = "";
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

        <td>${product.part}</td>

        <td>
  Rp${product.harga.toLocaleString("id-ID")}

  ${product.diskon > 0 ? `
    <br>
    <span style="color:red;">
      -${product.diskon}%
    </span>
  ` : ""}
</td>
        <td>${product.kategori || "-"}</td>
      
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
function editProduct(index){

  console.log(index)
  const product = products[index];
  const name =
  prompt("Edit Nama",product.name);

  const part =
  prompt("Edit Part",product.part);

  const price =
  prompt("Edit Harga",product.price);

  const image =
  prompt("Edit URL Gambar",product.image);

  if(name && part && price && image){

    products[index] = {
      name,
      part,
      price,
      image
    };

    saveProducts();

    renderProducts();

  }

}

// LOGOUT
function logout(){

  localStorage.removeItem("isLogin");

  window.location.href =
  "login.html";

}

renderProducts();