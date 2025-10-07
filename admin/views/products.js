window.AdminProducts = {
  async render(root) {
    root.innerHTML = `
      <div class="toolbar">
        <input id="pName" placeholder="Name" />
        <input id="pPrice" placeholder="Price" type="number" />
        <select id="pCategory"></select>
        <input id="pStock" placeholder="Stock" type="number" />
        <input id="pImage" type="file" accept="image/*" />
        <button class="primary" id="addProductBtn">Add</button>
      </div>
      <table>
        <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
        <tbody id="productsRows"></tbody>
      </table>`;

    await this.loadCategories();
    await this.loadProducts();
    document.getElementById('addProductBtn').addEventListener('click', () => this.add());
  },

  async loadCategories() {
    const sel = document.getElementById('pCategory');
    const res = await AdminAPI.api('/categories');
    (res.data || []).forEach(c => {
      const o = document.createElement('option'); o.value = c.id; o.textContent = c.name; sel.appendChild(o);
    });
  },

  async loadProducts() {
    const rows = document.getElementById('productsRows');
    const res = await AdminAPI.api('/products');
    rows.innerHTML = '';
    (res.data || []).forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img class="thumb" src="${p.image}" alt="${p.name}" /></td>
        <td>${p.name}</td>
        <td>₹${p.price}</td>
        <td>${p.stock}</td>
        <td>
          <button data-id="${p.id}" class="dec">-</button>
          <button data-id="${p.id}" class="inc">+</button>
          <button data-id="${p.id}" class="del">Delete</button>
        </td>`;
      rows.appendChild(tr);
    });

    rows.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      if (!id) return;
      if (e.target.classList.contains('del')) {
        await AdminAPI.api(`/products/${id}`, { method: 'DELETE' });
      }
      if (e.target.classList.contains('inc')) {
        await AdminAPI.api(`/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ stock: 1, operation: 'add' }) });
      }
      if (e.target.classList.contains('dec')) {
        await AdminAPI.api(`/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ stock: 1, operation: 'subtract' }) });
      }
      await this.loadProducts();
    });
  },

  async add() {
    const name = document.getElementById('pName').value.trim();
    const price = parseFloat(document.getElementById('pPrice').value);
    const category_id = parseInt(document.getElementById('pCategory').value);
    const stock = parseInt(document.getElementById('pStock').value || '0');
    const file = document.getElementById('pImage').files[0];

    let image;
    if (file) {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('/api/products/upload', { method: 'POST', body: fd });
      const json = await res.json();
      image = json?.data?.url;
    }

    await AdminAPI.api('/products', { method: 'POST', body: JSON.stringify({ name, price, category_id, stock, image }) });
    await this.loadProducts();
  }
};


