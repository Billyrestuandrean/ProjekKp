function renderProducts(){
    const table = document.getElementById("adminProductList");
    table.innerHTML = "";

    products.forEach((product,index)=>{
        table.innerHTML += `
            <tr>
                <td>
                    <img src="${product.image}">
                </td>

                <td>${product.name}</td>
                <td>${product.part}</td>

               <td>
  Rp${Number(product.harga || 0).toLocaleString("id-ID")}

  ${product.diskon > 0 ? `
    <br>
    <span style="text-decoration:line-through; color:gray;">
      Rp${Number(product.harga || 0).toLocaleString("id-ID")}
    </span>
    <br>
    <span style="color:red; font-weight:bold;">
      Rp${(product.harga - (product.harga * product.diskon / 100)).toLocaleString("id-ID")}
    </span>
  ` : ""}
</td>

                <td>${product.kategori || "-"}</td>

                <td>
                    <button class="btn-edit" onclick="editProduct(${index})">
                        Edit
                    </button>

                    <button class="btn-delete" onclick="deleteProduct(${index})">
                        Hapus
                    </button>
                </td>
            </tr>
        `;
    });
}

function addProduct(){
    const name = document.getElementById("name").value;
const part = document.getElementById("part").value;
const price = Number(document.getElementById("price").value);
const image = document.getElementById("image").value;
const kategori = document.getElementById("kategori").value;
const diskon = Number(document.getElementById("diskon").value || 0);
    if(name === "" || part === "" || price === "" || image === ""){
        alert("Semua field wajib diisi!");
        return;
    }

   products.push({
    name,
    part,
    price,
    image,
    kategori,
    diskon
});

    renderProducts();

    document.getElementById("productName").value = "";
    document.getElementById("productPart").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productImage").value = "";
}

function deleteProduct(index){
    if(confirm("Yakin ingin menghapus produk?")){
        products.splice(index,1);
        renderProducts();
    }
}

function editProduct(index){
    const product = products[index];

    const newName = prompt("Edit Nama Produk", product.name);
    const newPart = prompt("Edit Part Number", product.part);
    const newHarga = prompt("Edit Harga", product.harga);
    const newImage = prompt("Edit URL Gambar", product.image);
    const newKategori = prompt("Edit Kategori", product.kategori);
    if(newName && newPart && newPrice && newImage){
        products[index] = {
    name: newName,
    part: newPart,
    harga: newHarga,
    image: newImage,
    kategori: newKategori
};
        renderProducts();
    }
}

renderProducts();