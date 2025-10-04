// Service Worker - Chandra Dukan App
// Offline functionality और push notifications के लिए

const CACHE_NAME = 'chandra-dukan-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/components/Header.js',
  '/components/SearchBar.js',
  '/components/ProductCard.js',
  '/components/CartModal.js',
  '/components/CheckoutModal.js',
  '/components/OrderConfirmModal.js',
  '/components/Dashboard.js',
  '/services/CartService.js',
  '/services/NotificationService.js',
  '/services/DataService.js',
  '/utils/helpers.js',
  '/manifest.json'
];

// Install event - Cache करना
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - Offline support
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - Old cache clear करना
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push event - Push notifications handle करना
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from Chandra Dukan',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Order',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Chandra Dukan', options)
  );
});

// Notification click event - Notification click handle करना
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/?action=orders')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync - Background sync handle करना
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync data when online
      syncData()
    );
  }
});

// Sync data function - Data sync करना
async function syncData() {
  try {
    // Sync cart data
    const cartData = await getStoredData('chandraDukanCart');
    if (cartData) {
      // Send to server
      await fetch('/api/sync-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartData)
      });
    }
  } catch (error) {
    console.log('Sync failed:', error);
  }
}

// Get stored data - Stored data get करना
async function getStoredData(key) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(`/data/${key}`);
    if (response) {
      return await response.json();
    }
  } catch (error) {
    console.log('Error getting stored data:', error);
  }
  return null;
}
