window.AdminCategories = {
  async render(root) {
    root.innerHTML = `
      <div class="toolbar">
        <input id="cName" placeholder="Category name" />
        <input id="cHindi" placeholder="Hindi name" />
        <input id="cIcon" placeholder="Icon (emoji)" />
        <button class="primary" id="addCategoryBtn">Add</button>
      </div>
      <table>
        <thead><tr><th>Icon</th><th>Name</th><th>Hindi</th><th>Actions</th></tr></thead>
        <tbody id="categoriesRows"></tbody>
      </table>`;
    document.getElementById('addCategoryBtn').addEventListener('click', () => this.add());
    await this.load();
  },
  async load() {
    const rows = document.getElementById('categoriesRows');
    const res = await AdminAPI.api('/categories');
    rows.innerHTML = '';
    (res.data || []).forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.icon}</td>
        <td>${c.name}</td>
        <td>${c.hindi_name || ''}</td>
        <td><button class="del" data-id="${c.id}">Delete</button></td>`;
      rows.appendChild(tr);
    });
    rows.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      if (!id) return;
      if (e.target.classList.contains('del')) {
        await AdminAPI.api(`/categories/${id}`, { method: 'DELETE' });
        await this.load();
      }
    });
  },
  async add() {
    const name = document.getElementById('cName').value.trim();
    const hindi_name = document.getElementById('cHindi').value.trim();
    const icon = document.getElementById('cIcon').value.trim();
    await AdminAPI.api('/categories', { method: 'POST', body: JSON.stringify({ name, hindi_name, icon }) });
    await this.load();
  }
};


