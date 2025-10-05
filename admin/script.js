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
    nav('navAnalytics', 'analytics');
  },
  async render() {
    if (!this.viewEl) return;
    const v = this.state.view;
    if (v === 'products') return window.AdminProducts.render(this.viewEl);
    if (v === 'categories') return window.AdminCategories.render(this.viewEl);
    if (v === 'orders') return window.AdminOrders.render(this.viewEl);
    if (v === 'customers') return window.AdminCustomers.render(this.viewEl);
    if (v === 'analytics') return window.AdminAnalytics.render(this.viewEl);
  }
};

async function api(path, opts = {}) {
  const res = await fetch(`/api${path}`, { headers: { 'Content-Type': 'application/json' }, credentials: 'include', ...opts });
  if (!res.ok) throw new Error(`API ${path} failed`);
  return res.json();
}

window.AdminAPI = { api };


