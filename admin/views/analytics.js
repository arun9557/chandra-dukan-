window.AdminAnalytics = {
  async render(root) {
    root.innerHTML = `
      <div class="toolbar">
        <input id="aStart" type="date" />
        <input id="aEnd" type="date" />
        <button id="loadAnalytics">Load</button>
      </div>
      <div id="analyticsData"></div>`;
    document.getElementById('loadAnalytics').addEventListener('click', () => this.load());
    await this.load();
  },
  async load() {
    const start = document.getElementById('aStart').value;
    const end = document.getElementById('aEnd').value;
    const target = document.getElementById('analyticsData');
    const res = await AdminAPI.api(`/orders/analytics/summary${start && end ? `?start_date=${start}&end_date=${end}` : ''}`);
    const d = res.data || {};
    target.innerHTML = `
      <div class="cards">
        <div class="card">Total Orders: ${d.total_orders || 0}</div>
        <div class="card">Revenue: ₹${d.total_revenue || 0}</div>
        <div class="card">Avg Order: ₹${Math.round(d.average_order_value || 0)}</div>
      </div>`;
  }
};


