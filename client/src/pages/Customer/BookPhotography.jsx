import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Upload, X, Camera } from 'lucide-react';
import { packageAPI, bookingAPI } from '../../api';
import toast from 'react-hot-toast';

export default function BookPhotography() {
  const [packages, setPackages] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const packageIdParam = searchParams.get('packageId') || '';

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      package_id: packageIdParam,
    }
  });

  useEffect(() => {
    packageAPI.getAll()
      .then(({ data }) => {
        setPackages(data.packages || []);
        if (packageIdParam) {
          setValue('package_id', packageIdParam);
        }
      })
      .catch(() => toast.error('Failed to load packages'));
  }, [packageIdParam, setValue]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      return toast.error('Maximum 5 reference images allowed');
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    images.forEach((img) => {
      formData.append('reference_images', img);
    });

    try {
      await bookingAPI.create(formData);
      toast.success('Booking request submitted! We will contact you soon.');
      navigate('/dashboard/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 className="font-display">Book a Photography Session</h2>
        <p style={{ color: 'var(--white-40)', fontSize: '0.9rem', marginTop: '6px' }}>
          Tell us about your event, select a pricing tier, and provide any details/creative references.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card-glass auth-card" style={{ maxWidth: 'none', padding: '32px' }}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className={`form-input ${errors.customer_name ? 'error' : ''}`}
              {...register('customer_name', { required: 'Name is required' })}
            />
            {errors.customer_name && <span className="form-error">{errors.customer_name.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className={`form-input ${errors.customer_phone ? 'error' : ''}`}
              {...register('customer_phone', { required: 'Phone is required' })}
            />
            {errors.customer_phone && <span className="form-error">{errors.customer_phone.message}</span>}
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className={`form-input ${errors.customer_email ? 'error' : ''}`}
              {...register('customer_email', { required: 'Email is required' })}
            />
            {errors.customer_email && <span className="form-error">{errors.customer_email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Event Type</label>
            <select
              className={`form-select ${errors.event_type ? 'error' : ''}`}
              {...register('event_type', { required: 'Event type is required' })}
            >
              <option value="">Select type...</option>
              <option value="wedding">Wedding Photography</option>
              <option value="birthday">Birthday Celebration</option>
              <option value="graduation">Graduation</option>
              <option value="event">Corporate/Social Event</option>
              <option value="commercial">Commercial/Brand Shoot</option>
              <option value="outdoor">Outdoor/Nature Session</option>
              <option value="other">Other</option>
            </select>
            {errors.event_type && <span className="form-error">{errors.event_type.message}</span>}
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label className="form-label">Select Package</label>
            <select
              className={`form-select ${errors.package_id ? 'error' : ''}`}
              {...register('package_id', { required: 'Package is required' })}
            >
              <option value="">Choose package...</option>
              {packages.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>
                  {pkg.name} — LKR {pkg.price.toLocaleString()} ({pkg.duration})
                </option>
              ))}
            </select>
            {errors.package_id && <span className="form-error">{errors.package_id.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Location / Address</label>
            <input
              type="text"
              className={`form-input ${errors.location ? 'error' : ''}`}
              placeholder="e.g. Central Park, NY or Event Venue Name"
              {...register('location', { required: 'Location is required' })}
            />
            {errors.location && <span className="form-error">{errors.location.message}</span>}
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label className="form-label">Event Date</label>
            <input
              type="date"
              className={`form-input ${errors.event_date ? 'error' : ''}`}
              {...register('event_date', { required: 'Date is required' })}
            />
            {errors.event_date && <span className="form-error">{errors.event_date.message}</span>}
          </div>

          <div className="form-grid" style={{ gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className={`form-input ${errors.start_time ? 'error' : ''}`}
                {...register('start_time', { required: 'Required' })}
              />
              {errors.start_time && <span className="form-error">{errors.start_time.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="time"
                className={`form-input ${errors.end_time ? 'error' : ''}`}
                {...register('end_time', { required: 'Required' })}
              />
              {errors.end_time && <span className="form-error">{errors.end_time.message}</span>}
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '20px' }}>
          <label className="form-label">Special Requests / Notes</label>
          <textarea
            rows={4}
            className="form-textarea"
            placeholder="Tell us about special props, styles, drone shots, key items to highlight..."
            {...register('special_request')}
          />
        </div>

        {/* Reference Images */}
        <div className="form-group" style={{ marginTop: '20px' }}>
          <label className="form-label">Reference Images (Optional, Max 5)</label>
          <div className="dropzone" style={{ position: 'relative' }}>
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              onChange={handleImageChange}
            />
            <Upload size={32} style={{ color: 'var(--gold)', marginBottom: '12px' }} />
            <div>Click to upload images reference</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--white-40)', marginTop: '4px' }}>PNG, JPG or WebP files</div>
          </div>

          {imagePreviews.length > 0 && (
            <div className="preview-grid">
              {imagePreviews.map((preview, i) => (
                <div key={i} className="preview-thumb">
                  <img src={preview} alt="preview" />
                  <button type="button" className="remove-thumb-btn" onClick={() => removeImage(i)}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '32px' }}>
          <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
            {submitting ? 'Submitting Request...' : 'Submit Booking Request 📸'}
          </button>
        </div>
      </form>
    </div>
  );
}
