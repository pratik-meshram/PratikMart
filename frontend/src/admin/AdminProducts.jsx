import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import './Admin.css';

const emptyForm = { name: '', description: '', price: '', originalPrice: '', category: '', stock: '', image: '', featured: false, tags: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const load = () => api.get('/admin/products').then(r => { setProducts(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const openAdd = () => { 
    setEditing(null); 
    setForm(emptyForm); 
    setImageFiles([]);
    setImagePreviews([]);
    setErrors({});
    setModal(true); 
  };
  
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, tags: p.tags?.join(', ') || '', originalPrice: p.originalPrice || '' });
    setImageFiles([]);
    setImagePreviews(p.images || [p.image]);
    setErrors({});
    setModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setImageFiles(validFiles);
    
    // Create previews
    const previews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name || form.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    if (!form.description || form.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    if (!form.price || Number(form.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (form.originalPrice && Number(form.originalPrice) < Number(form.price)) {
      newErrors.originalPrice = 'Original price must be greater than price';
    }
    if (!form.category || form.category.trim().length < 2) {
      newErrors.category = 'Category is required';
    }
    if (!form.stock || Number(form.stock) < 0) {
      newErrors.stock = 'Stock must be 0 or greater';
    }
    if (!editing && imageFiles.length === 0 && !form.image) {
      newErrors.image = 'At least one image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix validation errors');
      return;
    }
    
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('description', form.description.trim());
      formData.append('price', form.price);
      formData.append('category', form.category.trim());
      formData.append('stock', form.stock);
      formData.append('featured', form.featured);
      
      if (form.originalPrice) formData.append('originalPrice', form.originalPrice);
      if (form.tags) formData.append('tags', form.tags);
      if (!imageFiles.length && form.image) formData.append('image', form.image);
      
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      if (editing) {
        await api.put(`/admin/products/${editing}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated');
      } else {
        await api.post('/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product added');
      }
      
      setModal(false);
      load();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Error saving product';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Product</button>
      </div>

      {loading ? <div className="flex-center" style={{ padding: '60px' }}><div className="spinner" /></div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td><img src={p.image} alt={p.name} /></td>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.category}</td>
                  <td>₹{p.price.toLocaleString()}</td>
                  <td><span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>{p.stock}</span></td>
                  <td>{p.featured ? '✅' : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}><Edit size={14} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input className={`form-control ${errors.name ? 'error' : ''}`} value={form.name} 
                    onChange={e => set('name', e.target.value)} />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                  <label>Description *</label>
                  <textarea className={`form-control ${errors.description ? 'error' : ''}`} rows={3} 
                    value={form.description} onChange={e => set('description', e.target.value)} />
                  {errors.description && <span className="error-text">{errors.description}</span>}
                </div>
                
                <div className="grid-2">
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input type="number" className={`form-control ${errors.price ? 'error' : ''}`} 
                      value={form.price} onChange={e => set('price', e.target.value)} min={0} step="0.01" />
                    {errors.price && <span className="error-text">{errors.price}</span>}
                  </div>
                  <div className="form-group">
                    <label>Original Price (₹)</label>
                    <input type="number" className={`form-control ${errors.originalPrice ? 'error' : ''}`} 
                      value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} min={0} step="0.01" />
                    {errors.originalPrice && <span className="error-text">{errors.originalPrice}</span>}
                  </div>
                </div>
                
                <div className="grid-2">
                  <div className="form-group">
                    <label>Category *</label>
                    <input className={`form-control ${errors.category ? 'error' : ''}`} 
                      value={form.category} onChange={e => set('category', e.target.value)} />
                    {errors.category && <span className="error-text">{errors.category}</span>}
                  </div>
                  <div className="form-group">
                    <label>Stock *</label>
                    <input type="number" className={`form-control ${errors.stock ? 'error' : ''}`} 
                      value={form.stock} onChange={e => set('stock', e.target.value)} min={0} />
                    {errors.stock && <span className="error-text">{errors.stock}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Product Images * (Max 5, up to 5MB each)</label>
                  <div className="image-upload-area">
                    <input type="file" id="imageUpload" accept="image/*" multiple 
                      onChange={handleImageChange} style={{ display: 'none' }} />
                    <label htmlFor="imageUpload" className="upload-label">
                      <Upload size={24} />
                      <span>Click to upload images</span>
                      <span className="text-gray fs-sm">JPEG, PNG, GIF, WebP</span>
                    </label>
                  </div>
                  {errors.image && <span className="error-text">{errors.image}</span>}
                  
                  {imagePreviews.length > 0 && (
                    <div className="image-previews">
                      {imagePreviews.map((preview, i) => (
                        <div key={i} className="image-preview">
                          <img src={preview} alt={`Preview ${i + 1}`} />
                          <button type="button" className="remove-image-btn" onClick={() => removeImage(i)}>
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input className="form-control" value={form.tags} 
                    onChange={e => set('tags', e.target.value)} placeholder="electronics, wireless, ..." />
                </div>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                  Featured Product
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
