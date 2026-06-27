import { useState, useEffect } from 'react';
import { galleryAPI } from '../../api';
import toast from 'react-hot-toast';
import { Plus, Trash2, X, Upload } from 'lucide-react';

const categories = ['wedding', 'birthday', 'graduation', 'events', 'portraits', 'commercial', 'nature', 'outdoor'];

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form Fields
  const [uploadCategory, setUploadCategory] = useState('events');
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data } = await galleryAPI.getAll();
      setImages(data.images || []);
    } catch {
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const handleRemovePreview = (idx) => {
    const files = [...selectedFiles];
    files.splice(idx, 1);
    setSelectedFiles(files);

    const prevs = [...previews];
    prevs.splice(idx, 1);
    setPreviews(prevs);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return toast.error('Please select at least one image');

    setUploading(true);
    const formData = new FormData();
    formData.append('category', uploadCategory);
    formData.append('title', uploadTitle);

    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await galleryAPI.upload(formData);
      toast.success('Images uploaded successfully! 🖼️');
      setShowUploadModal(false);
      setSelectedFiles([]);
      setPreviews([]);
      setUploadTitle('');
      fetchImages();
    } catch {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image from portfolio?')) return;
    try {
      await galleryAPI.delete(id);
      toast.success('Image deleted from portfolio');
      setImages(images.filter((img) => img._id !== id));
    } catch {
      toast.error('Failed to delete image');
    }
  };

  const filteredImages = filter === 'all' ? images : images.filter((img) => img.category === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 className="font-display">Portfolio Gallery Manager</h2>
          <p style={{ color: 'var(--white-40)', fontSize: '0.85rem' }}>Upload high-resolution photography projects to the public landing page.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowUploadModal(true)}>
          <Plus size={16} /> Upload Images
        </button>
      </div>

      {/* Categories Filter */}
      <div className="portfolio-filters" style={{ justifyContent: 'flex-start', marginBottom: '24px' }}>
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="loading-spinner" />
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--white-40)' }}>
          No images uploaded in this category.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {filteredImages.map((img) => (
            <div key={img._id} className="portfolio-item" style={{ aspectRatio: '1', border: '1px solid var(--dark-border)' }}>
              <img src={img.image_url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div
                className="portfolio-overlay"
                style={{
                  opacity: 1,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  padding: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--white)' }}>{img.title}</div>
                  <span className="badge badge-completed" style={{ fontSize: '0.65rem', marginTop: '4px', textTransform: 'uppercase', padding: '2px 8px' }}>{img.category}</span>
                </div>
                <button
                  onClick={() => handleDelete(img._id)}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    border: '1.5px solid var(--rejected)',
                    color: 'var(--rejected)',
                    padding: '6px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Upload Portfolio Images</h3>
              <button className="modal-close" onClick={() => setShowUploadModal(false)}><X size={16} /></button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)}>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Collection Title / Event Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Wedding photoshoot / Outdoor session"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Images</label>
                <div className="dropzone" style={{ position: 'relative' }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                    onChange={handleFileChange}
                  />
                  <Upload size={32} style={{ color: 'var(--gold)', marginBottom: '12px' }} />
                  <div>Drag and drop or select files</div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--white-40)' }}>Supports PNG, JPG, JPEG</span>
                </div>
              </div>

              {previews.length > 0 && (
                <div className="preview-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  {previews.map((preview, i) => (
                    <div key={i} className="preview-thumb">
                      <img src={preview} alt="preview" />
                      <button type="button" className="remove-thumb-btn" onClick={() => handleRemovePreview(i)}><X size={10} /></button>
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" className="btn btn-primary w-full" disabled={uploading}>
                {uploading ? 'Uploading Collection...' : 'Confirm Upload'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
