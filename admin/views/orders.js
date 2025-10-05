window.AdminOrders = {
  async render(root) {
    root.innerHTML = `
      <div class="toolbar">
        <select id="oStatus">
          <option value="">All</option>
          <option>placed</option>
          <option>confirmed</option>
          <option>processing</option>
          <option>packed</option>
          <option>out_for_delivery</option>
          <option>delivered</option>
          <option>cancelled</option>
        </select>
        <button id="refreshOrders">Refresh</button>
      </div>
      <table>
        <thead><tr><th>ID</th><th>Customer</th><th>Status</th><th>Total</th><th>Actions</th></tr></thead>
        <tbody id="ordersRows"></tbody>
      </table>`;
    document.getElementById('refreshOrders').addEventListener('click', () => this.load());
    await this.load();
  },
  async load() {
    const status = document.getElementById('oStatus').value;
    const rows = document.getElementById('ordersRows');
    const res = await AdminAPI.api(`/orders${status ? `?status=${status}` : ''}`);
    rows.innerHTML = '';
    (res.data || []).forEach(o => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${o.id}</td>
        <td>${o.customer?.name} (${o.customer?.phone})</td>
        <td>${o.status}</td>
        <td>₹${o.final_amount}</td>
        <td>
          <select data-id="${o.id}" class="setStatus">
            <option ${o.status==='placed'?'selected':''}>placed</option>
            <option ${o.status==='confirmed'?'selected':''}>confirmed</option>
            <option ${o.status==='processing'?'selected':''}>processing</option>
            <option ${o.status==='packed'?'selected':''}>packed</option>
            <option ${o.status==='out_for_delivery'?'selected':''}>out_for_delivery</option>
            <option ${o.status==='delivered'?'selected':''}>delivered</option>
            <option ${o.status==='cancelled'?'selected':''}>cancelled</option>
          </select>
        </td>`;
      rows.appendChild(tr);
    });
    rows.addEventListener('change', async (e) => {
      if (!e.target.classList.contains('setStatus')) return;
      const id = e.target.getAttribute('data-id');
      const status = e.target.value;
      await AdminAPI.api(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      await this.load();
    });
  }
};


