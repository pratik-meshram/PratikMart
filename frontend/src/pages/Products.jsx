import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import './Products.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const page = Number(searchParams.get('page') || 1);
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    api.get('/products/categories').then(r => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (category) params.category = category;
    if (search) params.search = search;
    if (sort) params.sort = sort;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    api.get('/products', { params }).then(r => {
      setProducts(r.data.products);
      setTotal(r.data.total);
      setPages(r.data.pages);
      setLoading(false);
    });
  }, [page, category, search, sort, minPrice, maxPrice]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({});

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <div>
            <h1>All Products</h1>
            <p className="text-gray">{total} products found {search && `for "${search}"`}</p>
          </div>
          <div className="products-controls">
            <select className="form-control" value={sort} onChange={e => setParam('sort', e.target.value)} style={{ width: 'auto' }}>
              <option value="">Sort: Default</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <button className="btn btn-outline btn-sm" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="products-layout">
          {/* Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? 'open' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button onClick={clearFilters} className="btn btn-sm" style={{ color: 'var(--danger)' }}>
                <X size={14} /> Clear
              </button>
            </div>

            <div className="filter-group">
              <h4>Category</h4>
              <label className={`filter-option ${!category ? 'active' : ''}`}>
                <input type="radio" name="cat" checked={!category} onChange={() => setParam('category', '')} />
                All Categories
              </label>
              {categories.map(c => (
                <label key={c} className={`filter-option ${category === c ? 'active' : ''}`}>
                  <input type="radio" name="cat" checked={category === c} onChange={() => setParam('category', c)} />
                  {c}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input type="number" placeholder="Min" className="form-control" value={minPrice}
                  onChange={e => setParam('minPrice', e.target.value)} />
                <span>—</span>
                <input type="number" placeholder="Max" className="form-control" value={maxPrice}
                  onChange={e => setParam('maxPrice', e.target.value)} />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="products-main">
            {loading ? (
              <div className="flex-center" style={{ padding: '80px' }}><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <p>No products found.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid-4">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                {pages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} className={`page-btn ${page === p ? 'active' : ''}`}
                        onClick={() => setParam('page', p)}>{p}</button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
