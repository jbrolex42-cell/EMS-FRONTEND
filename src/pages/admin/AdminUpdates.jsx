import { useEffect, useState, useRef } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { timeAgo } from '../../utils/formatTime';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  FiPlus, FiTrash2, FiEdit2, FiX, FiImage,
  FiVideo, FiFileText, FiRefreshCw, FiEye,
  FiUpload, FiLink, FiAlertTriangle, FiCheck,
} from 'react-icons/fi';
import Loader from '../../components/Loader';

const TYPE_OPTIONS = [
  { value: 'news',    label: 'News',    icon: FiFileText, color: 'text-blue-400',  bg: 'bg-blue-500/10 border-blue-500/20' },
  { value: 'article', label: 'Article', icon: FiFileText, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  { value: 'photo',   label: 'Photo',   icon: FiImage,    color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { value: 'video',   label: 'Video',   icon: FiVideo,    color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20' },
];

/* ── Delete confirm ──────────────────────────────────────────────────── */
function DeleteModal({ post, onConfirm, onCancel, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!deleting ? onCancel : undefined} />
      <div className="relative w-full max-w-sm ems-card border border-red-500/20 shadow-2xl">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <FiAlertTriangle className="text-red-400" size={16} />
          </div>
          <div>
            <h3 className="text-ems-white font-semibold text-sm">Delete Post</h3>
            <p className="text-ems-muted text-xs mt-1 leading-relaxed">
              "<span className="text-white">{post.title}</span>" will be permanently deleted along with any uploaded media.
            </p>
          </div>
          {!deleting && (
            <button onClick={onCancel} className="text-ems-muted hover:text-white ml-auto"><FiX size={15} /></button>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} disabled={deleting}
            className="flex-1 py-2 rounded-xl border border-ems-border text-ems-muted text-sm hover:text-white transition-colors disabled:opacity-40">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={deleting}
            className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
            {deleting ? <><Loader size="sm" /> Deleting…</> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Create / Edit Panel ─────────────────────────────────────────────── */
function PostPanel({ editing, onClose, onSuccess }) {
  const [loading, setLoading]           = useState(false);
  const [uploading, setUploading]       = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedType, setSelectedType] = useState(editing?.type || 'news');
  const [mediaMode, setMediaMode]       = useState('url');
  const [preview, setPreview]           = useState(editing?.mediaUrl || '');
  // Track the Cloudinary publicId of the currently staged upload
  // so we can delete it from Cloudinary if the user replaces or cancels
  const [stagedPublicId, setStagedPublicId]         = useState(null);
  const [stagedResourceType, setStagedResourceType] = useState('image');
  const fileRef = useRef();
  const xhrRef  = useRef(); // so we can abort in-flight uploads

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm({
    defaultValues: editing ? {
      title:    editing.title,
      summary:  editing.summary,
      body:     editing.body,
      mediaUrl: editing.mediaUrl,
    } : {},
  });

  const mediaUrl = watch('mediaUrl');
  useEffect(() => { setPreview(mediaUrl); }, [mediaUrl]);

  // Abort any in-flight upload and clean up on unmount
  useEffect(() => {
    return () => { xhrRef.current?.abort(); };
  }, []);

  const handleTypeChange = (value) => {
    setSelectedType(value);
    if (fileRef.current) fileRef.current.value = '';
  };

  /* Delete a Cloudinary asset (fire-and-forget helper) */
  const deleteCloudinaryAsset = async (publicId, resourceType = 'image') => {
    if (!publicId) return;
    try {
      await api.delete('/uploads/media', { data: { publicId, resourceType } });
    } catch (err) {
      console.warn('Could not delete Cloudinary asset:', err.message);
    }
  };

  /* Clear the current media (and remove from Cloudinary if it was just uploaded) */
  const handleClearMedia = async () => {
    // Only delete from Cloudinary if it was a fresh upload in this session
    // (not the original URL on an existing post — that gets cleaned up on post delete)
    if (stagedPublicId) {
      await deleteCloudinaryAsset(stagedPublicId, stagedResourceType);
      setStagedPublicId(null);
    }
    setValue('mediaUrl', '');
    setPreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  /* Upload file to backend → Cloudinary */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // If there's already a staged upload from this session, delete it first
    if (stagedPublicId) {
      await deleteCloudinaryAsset(stagedPublicId, stagedResourceType);
      setStagedPublicId(null);
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadProgress(0);

    try {
      const res = await api.post('/uploads/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (evt.total) {
            setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        },
      });

      const { url, publicId, resourceType } = res.data;
      setValue('mediaUrl', url);
      setPreview(url);
      setStagedPublicId(publicId);
      setStagedResourceType(resourceType || 'image');
      toast.success('Media uploaded successfully');
    } catch (err) {
      console.error('Media upload error:', err);
      toast.error(err.response?.data?.message || 'Upload failed — try a URL instead');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        type: selectedType,
        // Pass publicId & resourceType so backend can clean up old media on updates
        ...(stagedPublicId && { mediaPublicId: stagedPublicId, mediaResourceType: stagedResourceType }),
      };

      if (editing) {
        await api.put(`/updates/${editing._id}`, payload);
        toast.success('Post updated');
      } else {
        await api.post('/updates', payload);
        toast.success('Post published');
      }

      reset();
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const isVideo = selectedType === 'video';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-ems-dark border-l border-ems-border h-full overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-ems-dark border-b border-ems-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-ems-white font-semibold text-sm">{editing ? 'Edit Post' : 'New Post'}</h2>
            <p className="text-ems-muted text-xs">Published to the public EMS Updates page</p>
          </div>
          <button onClick={onClose} className="text-ems-muted hover:text-white transition-colors p-1 rounded-lg hover:bg-ems-border/30">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">

          {/* Type selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-ems-muted uppercase tracking-wider">Content Type</label>
            <div className="grid grid-cols-4 gap-2">
              {TYPE_OPTIONS.map(({ value, label, icon: Icon, color, bg }) => (
                <button key={value} type="button"
                  onClick={() => handleTypeChange(value)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all ${
                    selectedType === value
                      ? `${bg} ${color} border-current`
                      : 'border-ems-border text-ems-muted hover:text-white hover:border-ems-muted'
                  }`}>
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ems-muted uppercase tracking-wider">Title *</label>
            <input {...register('title', { required: 'Title is required' })}
              placeholder="Enter a compelling headline..."
              className={`ems-input text-sm w-full ${errors.title ? 'border-red-500/70' : ''}`} />
            {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
          </div>

          {/* Summary */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ems-muted uppercase tracking-wider">Summary</label>
            <textarea {...register('summary')} rows={2}
              placeholder="Short description shown on cards..."
              className="ems-input text-sm w-full resize-none" />
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ems-muted uppercase tracking-wider">Full Content</label>
            <textarea {...register('body')} rows={5}
              placeholder="Full article body, news details, or caption..."
              className="ems-input text-sm w-full resize-none" />
          </div>

          {/* Media */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-ems-muted uppercase tracking-wider">
                {isVideo ? 'Video' : 'Image'} (optional)
              </label>
              <div className="flex gap-1">
                {['url', 'upload'].map(m => (
                  <button key={m} type="button" onClick={() => setMediaMode(m)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      mediaMode === m ? 'bg-ems-border text-white' : 'text-ems-muted hover:text-white'
                    }`}>
                    {m === 'url'
                      ? <><FiLink size={10} className="inline mr-1" />URL</>
                      : <><FiUpload size={10} className="inline mr-1" />Upload</>}
                  </button>
                ))}
              </div>
            </div>

            {/* Always-mounted hidden file input so ref is always valid */}
            <input
              ref={fileRef}
              type="file"
              accept={isVideo ? 'video/mp4,video/quicktime,video/webm' : 'image/jpeg,image/png,image/webp,image/gif'}
              onChange={handleFileChange}
              className="hidden"
            />

            {mediaMode === 'url' ? (
              <input {...register('mediaUrl')}
                placeholder={isVideo ? 'https://... .mp4' : 'https://... .jpg'}
                className="ems-input text-sm w-full" />
            ) : (
              <div>
                {uploading ? (
                  /* Upload progress bar */
                  <div className="w-full py-6 px-4 rounded-xl border-2 border-dashed border-ems-border flex flex-col items-center gap-3">
                    <p className="text-ems-muted text-xs">Uploading to Cloudinary…</p>
                    <div className="w-full bg-ems-border rounded-full h-1.5">
                      <div
                        className="bg-emergency-red h-1.5 rounded-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-ems-muted text-xs">{uploadProgress}%</p>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="w-full py-8 rounded-xl border-2 border-dashed border-ems-border text-ems-muted hover:border-emergency-red/40 hover:text-white transition-colors text-sm flex flex-col items-center gap-2">
                    <FiUpload size={20} />
                    <span>Click to upload {isVideo ? 'video' : 'image'}</span>
                    <span className="text-xs opacity-60">
                      {isVideo ? 'MP4, MOV, WebM — max 100MB' : 'JPG, PNG, WebP, GIF — max 100MB'}
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Preview — image */}
            {preview && !isVideo && (
              <div className="relative rounded-xl overflow-hidden h-36 border border-ems-border">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <button type="button" onClick={handleClearMedia}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black/90 transition-colors">
                  <FiX size={11} />
                </button>
              </div>
            )}

            {/* Preview — video */}
            {preview && isVideo && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-ems-black border border-ems-border text-xs">
                <FiCheck size={13} className="text-green-400 flex-shrink-0" />
                <span className="text-ems-muted truncate flex-1">{preview}</span>
                <button type="button" onClick={handleClearMedia}
                  className="text-red-400 hover:text-red-300 flex-shrink-0"><FiX size={13} /></button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading || uploading}
            className="w-full py-3 rounded-xl bg-emergency-red hover:bg-emergency-red/90 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {loading
              ? <><Loader size="sm" /> Saving…</>
              : editing
                ? <><FiEdit2 size={14} /> Update Post</>
                : <><FiPlus size={14} /> Publish Post</>}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Main Admin Updates Page ─────────────────────────────────────────── */
export default function AdminUpdates() {
  const [posts, setPosts]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [typeFilter, setTypeFilter]   = useState('');
  const [showPanel, setShowPanel]     = useState(false);
  const [editing, setEditing]         = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]       = useState(false);

  useEffect(() => { fetchPosts(); }, [page, typeFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15, ...(typeFilter && { type: typeFilter }) });
      const res = await api.get(`/updates?${params}`);
      setPosts(res.data.posts || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // The backend DELETE /updates/:id should also destroy the Cloudinary asset
      // using the mediaPublicId stored on the post document
      await api.delete(`/updates/${deleteTarget._id}`);
      toast.success('Post deleted');
      setDeleteTarget(null);
      fetchPosts();
    } catch {
      toast.error('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const openEdit   = (post) => { setEditing(post); setShowPanel(true); };
  const openCreate = ()     => { setEditing(null);  setShowPanel(true); };
  const typeCfg    = (type) => TYPE_OPTIONS.find(t => t.value === type) || TYPE_OPTIONS[0];

  return (
    <AdminLayout title="EMS Updates">
      {deleteTarget && (
        <DeleteModal
          post={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => !deleting && setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
      {showPanel && (
        <PostPanel
          editing={editing}
          onClose={() => { setShowPanel(false); setEditing(null); }}
          onSuccess={fetchPosts}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-ems-muted text-sm">
            Posts are visible to the public at <span className="text-white">/updates</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/updates" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-ems-border text-ems-muted hover:text-white text-sm transition-colors">
            <FiEye size={13} /> Preview
          </a>
          <button onClick={fetchPosts}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-ems-border text-ems-muted hover:text-white transition-colors">
            <FiRefreshCw size={13} />
          </button>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emergency-red hover:bg-emergency-red/90 text-white text-sm font-medium transition-colors shadow-lg shadow-emergency-red/20">
            <FiPlus size={14} /> New Post
          </button>
        </div>
      </div>

      {/* Type filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[{ value: '', label: 'All Posts' }, ...TYPE_OPTIONS.map(t => ({ value: t.value, label: t.label }))].map(({ value, label }) => (
          <button key={value} onClick={() => { setTypeFilter(value); setPage(1); }}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              typeFilter === value
                ? 'bg-emergency-red border-emergency-red text-white'
                : 'border-ems-border text-ems-muted hover:text-white'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="ems-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-ems-white font-semibold">All Posts ({total})</h3>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><Loader /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-ems-muted text-xs uppercase tracking-wider border-b border-ems-border">
                  {['Title', 'Type', 'Media', 'Author', 'Published', 'Actions'].map(h => (
                    <th key={h} className="text-left pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ems-border">
                {posts.map(post => {
                  const cfg  = typeCfg(post.type);
                  const Icon = cfg.icon;
                  return (
                    <tr key={post._id} className="hover:bg-ems-dark/60 transition-colors group">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          {post.mediaUrl && post.type !== 'video' ? (
                            <img src={post.mediaUrl} alt="" className="w-8 h-8 rounded-lg object-cover border border-ems-border flex-shrink-0" />
                          ) : (
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                              <Icon size={13} className={cfg.color} />
                            </div>
                          )}
                          <span className="text-ems-white font-medium text-xs line-clamp-1 max-w-xs">{post.title}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`status-badge text-xs border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                      </td>
                      <td className="py-3 pr-4 text-ems-muted text-xs">
                        {post.mediaUrl
                          ? <span className="text-green-400">✓ Yes</span>
                          : <span className="text-ems-muted">—</span>}
                      </td>
                      <td className="py-3 pr-4 text-ems-muted text-xs">
                        {post.author ? `${post.author.firstName} ${post.author.lastName}` : '—'}
                      </td>
                      <td className="py-3 pr-4 text-ems-muted text-xs">{timeAgo(post.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(post)}
                            className="p-1.5 rounded-lg text-ems-muted hover:text-white hover:bg-ems-border/40 transition-colors" title="Edit">
                            <FiEdit2 size={13} />
                          </button>
                          <button onClick={() => setDeleteTarget(post)}
                            className="p-1.5 rounded-lg text-ems-muted hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {posts.length === 0 && (
              <div className="text-center py-16">
                <FiFileText className="text-ems-muted mx-auto mb-3" size={22} />
                <p className="text-ems-muted text-sm">No posts yet</p>
                <button onClick={openCreate} className="mt-3 text-emergency-red text-xs hover:underline">
                  Create your first post
                </button>
              </div>
            )}
          </div>
        )}

        {total > 15 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-ems-border">
            <p className="text-ems-muted text-xs">Page {page} of {Math.ceil(total / 15)}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted text-xs disabled:opacity-40 hover:text-white">Prev</button>
              <button disabled={page * 15 >= total} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-ems-border text-ems-muted text-xs disabled:opacity-40 hover:text-white">Next</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
