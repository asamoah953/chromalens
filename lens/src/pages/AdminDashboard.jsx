import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { Users, Plus, LayoutDashboard, LogOut, Trash2, Layers, Pencil, X, CheckCircle } from 'lucide-react';

// ───────────────────────────────────────────────
// Shared form field styles
const inputCls =
  'w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition';

// ───────────────────────────────────────────────
// Edit Modal Component
function EditModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: product.name || '',
    price: product.price || '',
    description: product.description || '',
    benefits: Array.isArray(product.benefits) ? product.benefits.join(', ') : (product.benefits || ''),
    science: product.science || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrlUrl, setImageUrlUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState(product.image || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrlUrl('');
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUrlInput = (e) => {
    setImageUrlUrl(e.target.value);
    setImageFile(null);
    setPreviewUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('price', formData.price);
    submitData.append('description', formData.description);
    submitData.append(
      'benefits',
      JSON.stringify(formData.benefits.split(',').map((b) => b.trim()).filter(Boolean))
    );
    submitData.append('science', formData.science);

    if (imageFile) {
      submitData.append('imageFile', imageFile);
    } else if (imageUrlUrl) {
      submitData.append('imageUrlUrl', imageUrlUrl);
    }
    // If neither chosen, server keeps existing image

    const success = await onSave(product._id || product.id, submitData);
    setSaving(false);
    if (success) {
      setSaved(true);
      setTimeout(onClose, 900);
    } else {
      alert('Error updating product. Please ensure the backend is running.');
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal Panel */}
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: 'slideUp .25s ease' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-100 bg-zinc-50/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Pencil className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg leading-tight">Edit Product</h3>
              <p className="text-xs text-slate-500">Changes save to the database instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-xl hover:bg-zinc-200 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputCls}
                placeholder="e.g. UltraDark Series X"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (GH₵)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={inputCls}
                placeholder="400.00"
              />
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Product Image{' '}
                <span className="text-slate-400 font-normal">(leave blank to keep current)</span>
              </label>
              <div className="flex flex-wrap gap-3 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border file:border-zinc-200 file:text-sm file:font-medium file:cursor-pointer file:bg-white file:text-slate-700 hover:file:bg-zinc-50 transition-colors"
                />
                <span className="text-sm text-slate-400 font-medium">OR</span>
                <input
                  type="url"
                  value={imageUrlUrl}
                  onChange={handleUrlInput}
                  className="flex-1 min-w-0 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="Paste image URL..."
                />
              </div>
              {previewUrl && (
                <div className="mt-3 flex items-end gap-3">
                  <div className="h-24 w-28 rounded-xl overflow-hidden border border-zinc-200 shadow-sm flex-shrink-0">
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                  <span className="text-xs text-slate-400 pb-1">Current / Preview</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Short Description</label>
              <textarea
                rows="2"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={inputCls}
                placeholder="A compelling summary of the lens..."
              />
            </div>

            {/* Benefits */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Key Benefits{' '}
                <span className="text-slate-400 font-normal">(comma separated)</span>
              </label>
              <input
                type="text"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                className={inputCls}
                placeholder="UV Protection, Scratch resistant, Night mode"
              />
            </div>

            {/* Science */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">What Science Says</label>
              <textarea
                rows="3"
                value={formData.science}
                onChange={(e) => setFormData({ ...formData, science: e.target.value })}
                className={inputCls}
                placeholder="Explanation of the photochromic technology..."
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-zinc-200 text-slate-700 font-medium hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || saved}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white px-8 py-2.5 rounded-xl font-medium transition-colors"
            >
              {saved ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Saved!
                </>
              ) : saving ? (
                'Saving…'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ───────────────────────────────────────────────
// Main Dashboard
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdminAuth, logoutAdmin, products, addProduct, updateProduct, deleteProduct, visits } = useStore();

  // "Add" form state
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', benefits: '', science: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrlUrl, setImageUrlUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  // "Edit" modal state
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (!isAdminAuth) navigate('/admin');
  }, [isAdminAuth, navigate]);

  if (!isAdminAuth) return null;

  // ── Add form handlers ──
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImageUrlUrl(''); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const handleUrlInput = (e) => {
    setImageUrlUrl(e.target.value); setImageFile(null); setPreviewUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !imageUrlUrl) { alert('Please upload an image or provide an image URL.'); return; }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('price', formData.price);
    submitData.append('description', formData.description);
    submitData.append('benefits', JSON.stringify(formData.benefits.split(',').map((b) => b.trim()).filter(Boolean)));
    submitData.append('science', formData.science);
    if (imageFile) submitData.append('imageFile', imageFile);
    else submitData.append('imageUrlUrl', imageUrlUrl);

    const success = await addProduct(submitData);
    if (success) {
      setIsAdding(false);
      setFormData({ name: '', price: '', description: '', benefits: '', science: '' });
      setImageFile(null); setImageUrlUrl(''); setPreviewUrl('');
    } else {
      alert('Error adding product. Please ensure backend is running.');
    }
  };

  const handleLogout = () => { logoutAdmin(); navigate('/'); };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">

      {/* ── Admin Header ── */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="h-6 w-6 text-indigo-400" />
              <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
            </div>
            <button onClick={handleLogout} className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex items-center space-x-5">
            <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <Users className="h-7 w-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Store Visits</p>
              <p className="text-3xl font-bold text-slate-900">{visits || 1}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex items-center space-x-5">
            <div className="h-14 w-14 rounded-full bg-indigo-50 flex items-center justify-center">
              <Layers className="h-7 w-7 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Listings</p>
              <p className="text-3xl font-bold text-slate-900">{products.length}</p>
            </div>
          </div>
        </div>

        {/* ── Action Header ── */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Inventory Management</h2>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            {isAdding ? (
              <span className="text-sm">Cancel</span>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>Add Lens</span>
              </>
            )}
          </button>
        </div>

        {/* ── Add Product Form ── */}
        {isAdding && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 mb-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Lens Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} placeholder="e.g. UltraDark Series X" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price (GH₵)</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className={inputCls} placeholder="400.00" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Product Image (Upload or URL)</label>
                  <div className="flex gap-4 items-center flex-wrap">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full sm:w-auto text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border border-zinc-200 file:text-sm file:font-medium file:cursor-pointer file:bg-white file:text-slate-700 hover:file:bg-zinc-50 transition-colors" />
                    <span className="text-sm text-slate-400 font-medium">OR</span>
                    <input type="url" value={imageUrlUrl} onChange={handleUrlInput} className="flex-1 min-w-0 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Paste an external image URL here..." />
                  </div>
                  {previewUrl && (
                    <div className="mt-4 h-28 w-36 rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
                      <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Short Description</label>
                  <textarea rows="2" required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputCls} placeholder="A compelling summary of the lens..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Key Benefits (Comma separated)</label>
                  <input type="text" value={formData.benefits} onChange={(e) => setFormData({ ...formData, benefits: e.target.value })} className={inputCls} placeholder="UV Protection, Scratch resistant, Night mode" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">What Science Says</label>
                  <textarea rows="3" value={formData.science} onChange={(e) => setFormData({ ...formData, science: e.target.value })} className={inputCls} placeholder="Explanation of the photochromic technology used here..." />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-zinc-100">
                <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-medium transition-colors">
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Products List ── */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-100">
          <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
            <h3 className="font-semibold text-slate-900 text-lg">Current Listings</h3>
          </div>
          <div className="divide-y divide-zinc-100">
            {products.map((product) => (
              <div key={product._id || product.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/70 transition-colors group">
                <div className="flex items-center space-x-6">
                  <div className="h-20 w-24 rounded-lg overflow-hidden bg-zinc-200 flex-shrink-0 border border-black/5">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">{product.name}</h4>
                    <span className="text-indigo-600 font-medium">GH₵{parseFloat(product.price).toFixed(2)}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {/* Edit */}
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200"
                    title="Edit product"
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => { if (window.confirm('Are you sure you want to permanently delete this lens?')) deleteProduct(product._id || product.id); }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Delete product"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="p-12 text-center text-slate-500">No products found. Start by adding some.</div>
            )}
          </div>
        </div>

      </div>

      {/* ── Edit Modal ── */}
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={updateProduct}
        />
      )}
    </div>
  );
}
