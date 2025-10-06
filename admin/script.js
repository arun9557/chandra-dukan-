window.AdminApp = {
  state: { view: 'products' },
  init() {
    this.cache();
    this.bind();
    this.render();
  },
  cache() {
    this.viewEl = document.getElementById('view');
  },
  bind() {
    const nav = (id, view) => document.getElementById(id)?.addEventListener('click', (e) => { e.preventDefault(); this.state.view = view; this.render(); });
    nav('navProducts', 'products');
    nav('navCategories', 'categories');
    nav('navOrders', 'orders');
    nav('navCustomers', 'customers');
    nav('navJanSeva', 'janseva');
    nav('navAnalytics', 'analytics');
  },
  async render() {
    if (!this.viewEl) return;
    const v = this.state.view;
    if (v === 'products') return window.AdminProducts.render(this.viewEl);
    if (v === 'categories') return window.AdminCategories.render(this.viewEl);
    if (v === 'orders') return window.AdminOrders.render(this.viewEl);
    if (v === 'customers') return window.AdminCustomers.render(this.viewEl);
    if (v === 'janseva') return this.renderJanSeva();
    if (v === 'analytics') return window.AdminAnalytics.render(this.viewEl);
  },
  renderJanSeva() {
    this.viewEl.innerHTML = `
      <h2>🏛️ Jan Seva Kendra - Applications Management</h2>
      <div id="janSevaStats"></div>
      <div class="filters" style="margin: 20px 0;">
        <input type="text" id="appSearch" placeholder="Search applications..." style="padding: 10px; width: 300px; border: 1px solid #ddd; border-radius: 5px;">
        <button class="filter-btn active" onclick="filterApplications('all')">All</button>
        <button class="filter-btn" onclick="filterApplications('pending')">Pending</button>
        <button class="filter-btn" onclick="filterApplications('under_review')">Under Review</button>
        <button class="filter-btn" onclick="filterApplications('approved')">Approved</button>
        <button class="filter-btn" onclick="filterApplications('completed')">Completed</button>
      </div>
      <div id="applicationsTable"></div>
    `;
  }
};

async function api(path, opts = {}) {
  const res = await fetch(`/api${path}`, { headers: { 'Content-Type': 'application/json' }, credentials: 'include', ...opts });
  if (!res.ok) throw new Error(`API ${path} failed`);
  return res.json();
}

window.AdminAPI = { api };


