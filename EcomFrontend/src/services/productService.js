import { sortProducts, filterProducts } from '../utils/helpers';
import { API_BASE_URL } from '../utils/constants';
import { authService } from './authService';

let cachedProducts = null;

function mapProduct(p) {
  let images = [];
  try { images = JSON.parse(p.imagesJson || '[]'); } catch { images = [p.imageUrl || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80']; }
  if (!images || images.length === 0) {
    images = [p.imageUrl || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80'];
  }

  let specifications = {};
  try { specifications = JSON.parse(p.specificationsJson || '{}'); } catch {}

  let features = [];
  try { features = JSON.parse(p.featuresJson || '[]'); } catch {}

  let tags = [];
  try { tags = JSON.parse(p.tagsJson || '[]'); } catch {}

  const discountVal = p.discount || 0;
  const calcOriginalPrice = discountVal > 0 ? Math.round(p.price / (1 - discountVal / 100)) : p.price;

  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: calcOriginalPrice,
    discount: discountVal,
    rating: p.rating || 4.5,
    reviewCount: p.reviewCount || 100,
    stock: p.stockQuantity,
    brand: p.brand,
    category: p.category,
    subcategory: p.subcategory,
    badge: p.badge || null,
    freeShipping: p.freeShipping,
    trending: p.trending,
    featured: p.featured,
    images,
    specifications,
    features,
    tags
  };
}

async function getProducts() {
  if (cachedProducts) return cachedProducts;

  const res = await fetch(`${API_BASE_URL}/products`, {
    headers: { ...authService.getAuthHeader() },
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to fetch products');

  const dbProducts = await res.json();
  cachedProducts = dbProducts.map(mapProduct);

  return cachedProducts;
}

async function fetchProductsFromApi(searchQuery) {
  const url = searchQuery 
    ? `${API_BASE_URL}/products?search=${encodeURIComponent(searchQuery)}`
    : `${API_BASE_URL}/products`;

  const res = await fetch(url, {
    headers: { ...authService.getAuthHeader() },
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to fetch products');

  const dbProducts = await res.json();
  return dbProducts.map(mapProduct);
}

export const productService = {
  async getAllProducts(filters = {}, sort = 'relevance') {
    let products;
    if (filters.query) {
      // Fetch directly from API when search is active
      products = await fetchProductsFromApi(filters.query);
    } else {
      // Fallback to client-side cache for regular browsing
      products = await getProducts();
    }
    let result = filterProducts(products, filters);
    return sortProducts(result, sort);
  },

  async getProductById(id) {
    const products = await getProducts();
    return products.find(p => p.id.toString() === id.toString()) || null;
  },

  async getFeatured() {
    const products = await getProducts();
    return products.filter(p => p.featured).slice(0, 8);
  },

  async getTrending() {
    const products = await getProducts();
    return products.filter(p => p.trending).slice(0, 8);
  },

  async getBestSellers() {
    const products = await getProducts();
    return [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
  },

  async getByCategory(categoryId) {
    const products = await getProducts();
    return products.filter(p => p.category === categoryId);
  },

  async search(query) {
    // Perform search directly against the database API
    return await fetchProductsFromApi(query);
  },

  async getRelated(productId, category) {
    const products = await getProducts();
    return products.filter(p => p.category === category && p.id.toString() !== productId.toString()).slice(0, 6);
  },

  async getDeals() {
    const products = await getProducts();
    return [...products].filter(p => p.discount >= 20).sort((a, b) => b.discount - a.discount);
  },

  async getBrands(categoryId) {
    const products = await getProducts();
    const filtered = categoryId ? products.filter(p => p.category === categoryId) : products;
    return [...new Set(filtered.map(p => p.brand))].sort();
  },
};
