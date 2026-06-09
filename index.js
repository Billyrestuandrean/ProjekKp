//   // Mobile Menu Toggle
//         document.addEventListener('DOMContentLoaded', function() {
//             const mobileMenu = document.getElementById('mobileMenu');
//             const closeMobileMenu = document.getElementById('closeMobileMenu');
//             const mobileMenuButton = document.querySelector('header button.md\\:hidden');
            
//             mobileMenuButton.addEventListener('click', function() {
//                 mobileMenu.classList.remove('hidden');
//             });
            
//             closeMobileMenu.addEventListener('click', function() {
//                 mobileMenu.classList.add('hidden');
//             });
            
//             // Accordion functionality for mobile menu
//             const accordionBtns = document.querySelectorAll('.accordion-btn');
//             accordionBtns.forEach(btn => {
//                 btn.addEventListener('click', function() {
//                     const content = this.nextElementSibling;
//                     const icon = this.querySelector('i');
                    
//                     if (content.classList.contains('hidden')) {
//                         content.classList.remove('hidden');
//                         icon.style.transform = 'rotate(180deg)';
//                     } else {
//                         content.classList.add('hidden');
//                         icon.style.transform = 'rotate(0deg)';
//                     }
//                 });
//             });
            
//             // Add to cart animation
//             const addToCartButtons = document.querySelectorAll('button:has(.fa-cart-plus)');
//             addToCartButtons.forEach(button => {
//                 button.addEventListener('click', function() {
//                     const cartBadge = document.querySelector('.cart-badge');
//                     if (cartBadge) {
//                         // Animate the badge
//                         cartBadge.style.transform = 'scale(1.5)';
//                         setTimeout(() => {
//                             cartBadge.style.transform = 'scale(1)';
//                         }, 300);
                        
//                         // Increment cart count
//                         const currentCount = parseInt(cartBadge.textContent);
//                         cartBadge.textContent = currentCount + 1;
//                     }
                    
//                     // Button feedback
//                     this.innerHTML = '<i class="fas fa-check mr-1"></i> Added';
//                     this.classList.remove('bg-blue-600', 'hover:bg-blue-700');
//                     this.classList.add('bg-green-600', 'hover:bg-green-700');
                    
//                     setTimeout(() => {
//                         this.innerHTML = '<i class="fas fa-cart-plus"></i> Add';
//                         this.classList.remove('bg-green-600', 'hover:bg-green-700');
//                         this.classList.add('bg-blue-600', 'hover:bg-blue-700');
//                     }, 2000);
//                 });
//             });
            
//             // Model selector scroll buttons (would be implemented with more time)
//         });
        let products = [
    {
        name: "Oil Filter Suzuki",
        part: "16510-07J00",
        price: "Rp 185.000",
        image: "https://www.suzuki.co.id/assets/images/parts-accessories/oil-filter.jpg"
    },
    {
        name: "Air Filter Suzuki",
        part: "13881-07J00",
        price: "Rp 120.000",
        image: "https://www.suzuki.co.id/assets/images/parts-accessories/air-filter.jpg"
    }
];

// function renderProducts(){
//     const table = document.getElementById("adminProductList");
//     table.innerHTML = "";

//     products.forEach((product,index)=>{
//         table.innerHTML += `
//             <tr>
//                 <td>
//                     <img src="${product.image}">
//                 </td>
//                 <td>${product.name}</td>
//                 <td>${product.part}</td>
//                 <td>${product.price}</td>
//                 <td>
//                     <button class="btn-edit" onclick="editProduct(${index})"> 
//                         Edit
//                     </button>

//                     <button class="btn-delete" onclick="deleteProduct(${index})"> 
//                         Hapus
//                     </button>
//                 </td>
//             </tr>
//         `;
//     });
// }

// function addProduct(){
//     const name = document.getElementById("productName").value;
//     const part = document.getElementById("productPart").value;
//     const price = document.getElementById("productPrice").value;
//     const image = document.getElementById("productImage").value;

//     if(name === "" || part === "" || price === "" || image === ""){
//         alert("Semua field wajib diisi!");
//         return;
//     }

//     products.push({
//         name,
//         part,
//         price,
//         image
//     });

//     renderProducts();

//     document.getElementById("productName").value = "";
//     document.getElementById("productPart").value = "";
//     document.getElementById("productPrice").value = "";
//     document.getElementById("productImage").value = "";
// }

// function deleteProduct(index){
//     if(confirm("Yakin ingin menghapus produk?")){
//         products.splice(index,1);
//         renderProducts();
//     }
// }

// function editProduct(index){
//     const product = products[index];

//     const newName = prompt("Edit Nama Produk", product.name);
//     const newPart = prompt("Edit Part Number", product.part);
//     const newPrice = prompt("Edit Harga", product.price);
//     const newImage = prompt("Edit URL Gambar", product.image);

//     if(newName && newPart && newPrice && newImage){
//         products[index] = {
//             name:newName,
//             part:newPart,
//             price:newPrice,
//             image:newImage
//         };

//         renderProducts();
//     }
// }

// renderProducts();

function toggleDashboard(){
    const dashboard = document.getElementById("adminDashboard");

    dashboard.classList.toggle("show");
}


    let hasilFilter = productsData.filter(item =>
        (item.kategori || "").toLowerCase() === kategori.toLowerCase()
    );

    featuredProducts.innerHTML = "";

    if (hasilFilter.length === 0) {
        featuredProducts.innerHTML = `
            <div class="col-span-full text-center py-10">
                <h2 class="text-xl font-bold">Tidak ada produk ${kategori}</h2>
            </div>
        `;
        return;
    }

    hasilFilter.forEach(product => {
        featuredProducts.innerHTML += `
        <div class="part-card">
            <div class="card-img">
                <img src="${product.url_gambar}">
            </div>

            <div class="card-body">
                <h3>${product.nama_barang}</h3>

                <p class="part-no">
                    Part No: ${product.part}
                </p>

                <div class="card-footer">
                    <div class="harga">
                        Rp${Number(product.harga).toLocaleString("id-ID")}
                    </div>

                    <button class="btn-add" 
                        onclick="addToCart(${product.id_barang})">
                        <i class="fas fa-cart-plus"></i>
                        Tambah
                    </button>
                </div>
            </div>
        </div>
        `;
    });

    // reset tombol "lihat semua"
    document.getElementById("btnLihatSemua").innerText = "Lihat Semua";
    isShowAll = false;

function resetProduk() {
    renderWebsiteProducts(true);
}
