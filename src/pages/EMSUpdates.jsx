import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { timeAgo } from '../utils/formatTime';
import {
  FiSearch, FiPlay, FiImage, FiFileText,
  FiCalendar, FiUser, FiArrowRight, FiX,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';

const TYPE_CONFIG = {
  news:    { label: 'News',    color: 'bg-blue-500/20 text-blue-400 border-blue-500/20',    dot: 'bg-blue-400' },
  article: { label: 'Article', color: 'bg-green-500/20 text-green-400 border-green-500/20', dot: 'bg-green-400' },
  photo:   { label: 'Photo',   color: 'bg-amber-500/20 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
  video:   { label: 'Video',   color: 'bg-red-500/20 text-red-400 border-red-500/20',       dot: 'bg-red-400' },
};

/* ── Lightbox ────────────────────────────────────────────────────────── */
function Lightbox({ post, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto" onClick={onClose}>
      <div className="relative w-full max-w-3xl my-8 bg-ems-dark border border-ems-border rounded-2xl overflow-y-auto max-h-[90vh] shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 h-0 flex justify-end overflow-visible">
          <button onClick={onClose}
            className="mt-4 mr-4 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
            <FiX size={15} />
          </button>
        </div>

        {/* Media */}
        {post.type === 'video' && post.mediaUrl ? (
          <video src={post.mediaUrl} controls className="w-full max-h-96 object-cover" />
        ) : post.mediaUrl ? (
          <img src={post.mediaUrl} alt={post.title} className="w-full max-h-96 object-cover" />
        ) : null}

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${TYPE_CONFIG[post.type]?.color}`}>
              {TYPE_CONFIG[post.type]?.label}
            </span>
            <span className="text-ems-muted text-xs">{timeAgo(post.createdAt)}</span>
          </div>
          <h2 className="text-ems-white text-xl font-semibold mb-2 leading-snug">{post.title}</h2>
          {post.summary && <p className="text-ems-muted text-sm leading-relaxed mb-3">{post.summary}</p>}
          {post.body && <p className="text-ems-muted text-sm leading-relaxed whitespace-pre-line">{post.body}</p>}
          {post.author && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-ems-border">
              <div className="w-6 h-6 rounded-full bg-emergency-red/20 flex items-center justify-center">
                <FiUser size={11} className="text-emergency-red" />
              </div>
              <span className="text-ems-muted text-xs">By {post.author?.firstName} {post.author?.lastName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Post Card ───────────────────────────────────────────────────────── */
function PostCard({ post, onClick }) {
  const cfg = TYPE_CONFIG[post.type] || TYPE_CONFIG.news;

  return (
    <div onClick={() => onClick(post)}
      className="group ems-card cursor-pointer hover:border-emergency-red/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emergency-red/5 flex flex-col">

      {/* Thumbnail */}
      {post.mediaUrl && post.type !== 'video' ? (
        <div className="relative -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-2xl h-44">
          <img src={post.mediaUrl} alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-ems-dark/60 to-transparent" />
          <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
      ) : post.type === 'video' ? (
        <div className="relative -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-2xl h-44 bg-ems-black flex items-center justify-center">
          {post.mediaUrl
            ? <video src={post.mediaUrl} className="w-full h-full object-cover opacity-60" />
            : <div className="w-full h-full bg-gradient-to-br from-red-900/30 to-ems-black" />
          }
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emergency-red/90 flex items-center justify-center shadow-lg shadow-emergency-red/30">
              <FiPlay size={18} className="text-white ml-0.5" />
            </div>
          </div>
          <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
      )}

      <h3 className="text-ems-white font-semibold text-sm leading-snug mb-2 group-hover:text-emergency-red transition-colors line-clamp-2 flex-1">
        {post.title}
      </h3>

      {post.summary && (
        <p className="text-ems-muted text-xs leading-relaxed line-clamp-2 mb-3">{post.summary}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-ems-border">
        <div className="flex items-center gap-1.5 text-ems-muted text-xs">
          <FiCalendar size={11} />
          {timeAgo(post.createdAt)}
        </div>
        <FiArrowRight size={13} className="text-ems-muted group-hover:text-emergency-red group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}

/* ── Featured Hero Post ──────────────────────────────────────────────── */
function FeaturedPost({ post, onClick }) {
  if (!post) return null;
  return (
    <div onClick={() => onClick(post)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer mb-8 border border-ems-border hover:border-emergency-red/30 transition-all"
      style={{ minHeight: 320 }}>
      {post.mediaUrl ? (
        <img src={post.mediaUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-emergency-red/20 to-ems-black" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-emergency-red text-white font-medium">Featured</span>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${TYPE_CONFIG[post.type]?.color}`}>
            {TYPE_CONFIG[post.type]?.label}
          </span>
        </div>
        <h2 className="text-white text-2xl lg:text-3xl font-bold leading-tight mb-2 max-w-2xl group-hover:text-emergency-red/90 transition-colors">
          {post.title}
        </h2>
        {post.summary && (
          <p className="text-white/70 text-sm max-w-xl line-clamp-2">{post.summary}</p>
        )}
        <div className="flex items-center gap-3 mt-3 text-white/50 text-xs">
          <FiCalendar size={11} /> {timeAgo(post.createdAt)}
          {post.author && <><FiUser size={11} /> {post.author.firstName} {post.author.lastName}</>}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────── */
export default function EMSUpdates() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [activeType, setActiveType] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchPosts(); }, [page, activeType]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchPosts(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9, ...(activeType && { type: activeType }), ...(search && { search }) });
      const res = await api.get(`/updates?${params}`);
      setPosts(res.data.posts || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      console.error(e);
      // fallback empty state
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const featured = page === 1 && !activeType && !search ? posts[0] : null;
  const grid = featured ? posts.slice(1) : posts;

  return (
    <div className="min-h-screen bg-ems-black">
      {selected && <Lightbox post={selected} onClose={() => setSelected(null)} />}

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 bg-ems-black/90 backdrop-blur-md border-b border-ems-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emergency-red rounded-lg flex items-center justify-center shadow-lg shadow-emergency-red/30">
              <span className="text-white font-bold text-xs">EMS</span>
            </div>
            <span className="text-white font-semibold text-sm">EMS Kenya</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-ems-muted hover:text-white text-sm transition-colors">Sign In</Link>
            <Link to="/register" className="px-4 py-1.5 rounded-lg bg-emergency-red hover:bg-emergency-red/90 text-white text-sm font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emergency-red animate-pulse" />
            <span className="text-emergency-red text-xs font-medium uppercase tracking-widest">Live Updates</span>
          </div>
          <h1 className="text-white text-4xl font-bold tracking-tight mb-2">EMS Updates</h1>
          <p className="text-ems-muted text-sm">Latest news, articles, photos and videos from EMS Kenya</p>
        </div>

        {/* ── Search + Filter ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ems-muted" size={14} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search updates..."
              className="ems-input pl-10 text-sm w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[{ value: '', label: 'All' }, ...Object.entries(TYPE_CONFIG).map(([v, c]) => ({ value: v, label: c.label }))].map(({ value, label }) => (
              <button key={value}
                onClick={() => { setActiveType(value); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                  activeType === value
                    ? 'bg-emergency-red border-emergency-red text-white'
                    : 'border-ems-border text-ems-muted hover:text-white hover:border-ems-muted'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Featured ── */}
        {!loading && featured && <FeaturedPost post={featured} onClick={setSelected} />}

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="ems-card animate-pulse">
                <div className="h-44 -mx-5 -mt-5 mb-4 bg-ems-border/30 rounded-t-2xl" />
                <div className="h-4 bg-ems-border/30 rounded mb-2 w-3/4" />
                <div className="h-3 bg-ems-border/20 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : grid.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {grid.map(post => <PostCard key={post._id} post={post} onClick={setSelected} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-14 h-14 rounded-2xl bg-ems-dark border border-ems-border flex items-center justify-center mx-auto mb-4">
              <FiFileText className="text-ems-muted" size={22} />
            </div>
            <p className="text-ems-muted text-sm">No updates found</p>
            {(search || activeType) && (
              <button onClick={() => { setSearch(''); setActiveType(''); }}
                className="mt-3 text-emergency-red text-xs hover:underline">
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* ── Pagination ── */}
        {total > 9 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-ems-border text-ems-muted text-sm hover:text-white disabled:opacity-40 transition-colors">
              <FiChevronLeft size={14} /> Prev
            </button>
            <span className="text-ems-muted text-xs">Page {page} of {Math.ceil(total / 9)}</span>
            <button disabled={page * 9 >= total} onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-ems-border text-ems-muted text-sm hover:text-white disabled:opacity-40 transition-colors">
              Next <FiChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-ems-border mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-ems-muted text-xs">© {new Date().getFullYear()} EMS Kenya. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-ems-muted">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
