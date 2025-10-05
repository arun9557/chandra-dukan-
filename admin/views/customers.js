window.AdminCustomers = {
  async render(root) {
    root.innerHTML = `
      <div class="toolbar">
        <input id="cuName" placeholder="Name" />
        <input id="cuPhone" placeholder="Phone" />
        <input id="cuAddress" placeholder="Address" />
        <button class="primary" id="addCustomerBtn">Add</button>
      </div>
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Address</th></tr></thead>
        <tbody id="customersRows"></tbody>
      </table>`;
    document.getElementById('addCustomerBtn').addEventListener('click', () => this.add());
    await this.load();
  },
  async load() {
    const rows = document.getElementById('customersRows');
    const res = await AdminAPI.api('/customers');
    rows.innerHTML = '';
    (res.data || []).forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${c.id}</td><td>${c.name}</td><td>${c.phone}</td><td>${c.address || ''}</td>`;
      rows.appendChild(tr);
    });
  },
  async add() {
    const name = document.getElementById('cuName').value.trim();
    const phone = document.getElementById('cuPhone').value.trim();
    const address = document.getElementById('cuAddress').value.trim();
    await AdminAPI.api('/customers', { method: 'POST', body: JSON.stringify({ name, phone, address }) });
    await this.load();
  }
};


