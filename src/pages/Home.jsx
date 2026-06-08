import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/HeroSection';
import api from '../services/api';
import { timeAgo } from '../utils/formatTime';
import {
  FiArrowRight, FiCheckCircle, FiActivity, FiShield,
  FiMapPin, FiClock, FiZap, FiPlay, FiImage,
  FiCalendar, FiX,
} from 'react-icons/fi';
import { MEMBERSHIP_PLANS } from '../utils/constants';

/* ── Lightbox (for gallery) ──────────────────────────────────────────── */
function Lightbox({ post, onClose }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" onClick={onClose}>
      <div className="relative w-full max-w-3xl bg-ems-dark border border-ems-border rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/90 transition-colors">
          <FiX size={15} />
        </button>
        {post.type === 'video' && post.mediaUrl
          ? <video src={post.mediaUrl} controls autoPlay className="w-full max-h-[60vh] object-contain bg-black" />
          : post.mediaUrl
            ? <img src={post.mediaUrl} alt={post.title} className="w-full max-h-[60vh] object-contain bg-black" />
            : null}
        <div className="p-5">
          <h3 className="text-ems-white font-semibold mb-1">{post.title}</h3>
          {post.summary && <p className="text-ems-muted text-sm">{post.summary}</p>}
          <p className="text-ems-muted text-xs mt-2">{timeAgo(post.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Latest News Section ─────────────────────────────────────────────── */
function LatestNews() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/updates?limit=3&type=news')
      .then(res => setPosts(res.data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  // Also fetch articles to fill if news is sparse
  useEffect(() => {
    if (!loading && posts.length < 3) {
      api.get('/updates?limit=6')
        .then(res => {
          const all = res.data.posts || [];
          const newsAndArticles = all.filter(p => p.type === 'news' || p.type === 'article');
          setPosts(newsAndArticles.slice(0, 3));
        })
        .catch(() => {});
    }
  }, [loading]);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="text-emergency-red text-xs uppercase tracking-widest font-medium">Latest</span>
          <h2 className="text-3xl font-display text-ems-white mt-1">EMS NEWS & UPDATES</h2>
        </div>
        <Link to="/updates"
          className="flex items-center gap-2 text-ems-muted hover:text-white text-sm transition-colors group">
          View all <FiArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="ems-card animate-pulse">
              <div className="h-40 -mx-5 -mt-5 mb-4 bg-ems-border/30 rounded-t-2xl" />
              <div className="h-4 bg-ems-border/30 rounded mb-2 w-3/4" />
              <div className="h-3 bg-ems-border/20 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <Link to="/updates" key={post._id}
              className={`group ems-card hover:border-emergency-red/30 transition-all duration-200 hover:-translate-y-0.5 flex flex-col ${i === 0 ? 'md:col-span-1' : ''}`}>
              {post.mediaUrl && (
                <div className="-mx-5 -mt-5 mb-4 h-44 rounded-t-2xl overflow-hidden">
                  <img src={post.mediaUrl} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium capitalize">
                  {post.type}
                </span>
                <span className="text-ems-muted text-xs flex items-center gap-1">
                  <FiCalendar size={10} /> {timeAgo(post.createdAt)}
                </span>
              </div>
              <h3 className="text-ems-white font-semibold text-sm leading-snug mb-2 group-hover:text-emergency-red transition-colors line-clamp-2 flex-1">
                {post.title}
              </h3>
              {post.summary && (
                <p className="text-ems-muted text-xs leading-relaxed line-clamp-2">{post.summary}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Gallery Section (photos + videos) ──────────────────────────────── */
function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Fetch both photo and video posts
    Promise.all([
      api.get('/updates?limit=6&type=photo'),
      api.get('/updates?limit=6&type=video'),
    ])
      .then(([photos, videos]) => {
        const all = [
          ...(photos.data.posts || []),
          ...(videos.data.posts || []),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
        setItems(all);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="py-24 bg-ems-dark">
      {selected && <Lightbox post={selected} onClose={() => setSelected(null)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-emergency-red text-xs uppercase tracking-widest font-medium">Media</span>
            <h2 className="text-3xl font-display text-ems-white mt-1">PHOTOS & VIDEOS</h2>
          </div>
          <Link to="/updates?type=photo"
            className="flex items-center gap-2 text-ems-muted hover:text-white text-sm transition-colors group">
            View gallery <FiArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-ems-border/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item, i) => (
              <div key={item._id}
                onClick={() => setSelected(item)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer border border-ems-border hover:border-emergency-red/40 transition-all ${
                  i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
                }`}>
                {item.mediaUrl ? (
                  <img src={item.mediaUrl} alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-ems-border/40 to-ems-black flex items-center justify-center">
                    <FiImage size={24} className="text-ems-muted" />
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Video play button */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-emergency-red/90 flex items-center justify-center shadow-lg shadow-emergency-red/30 group-hover:scale-110 transition-transform">
                      <FiPlay size={14} className="text-white ml-0.5" />
                    </div>
                  </div>
                )}
                {/* Title on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  <p className="text-white text-xs font-medium line-clamp-2">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Home Page ───────────────────────────────────────────────────────── */
export default function Home() {
  const howItWorks = [
    { step: '01', title: 'Tap SOS or Call', desc: 'One tap on the app, USSD *888#, or call 0700 395 395. Works on any phone, any network.' },
    { step: '02', title: 'AI Triage & Dispatch', desc: 'Our AI assesses your emergency in Swahili or English and dispatches the closest, most equipped responder in seconds.' },
    { step: '03', title: 'Responder En Route', desc: 'Track your ambulance or motorcycle EMT live on the map. Get real-time ETA and responder details.' },
    { step: '04', title: 'SHA-Covered Care', desc: 'Our EMTs stabilize you on scene. SHA ECCIF covers the cost — no payment at the point of crisis.' }
  ];

  const features = [
    { icon: FiZap,          title: 'Sub-13 Minute Urban ETA',  desc: 'GPS-optimized dispatch gets you the nearest available unit — not just the nearest provider.' },
    { icon: FiMapPin,       title: '47-County Coverage',        desc: 'ALS ambulances, BLS units, and motorcycle first responders across Kenya, including Turkana and Garissa.' },
    { icon: FiShield,       title: 'KMPDC Certified EMTs',      desc: 'Every responder holds active KMPDC registration and BLS/ALS certification. No gig-economy shortcuts.' },
    { icon: FiActivity,     title: 'AI Voice Triage',           desc: 'NLP triage in Swahili and English assesses severity and guides bystanders in real time before help arrives.' },
    { icon: FiCheckCircle,  title: 'SHA ECCIF Integrated',      desc: 'Seamlessly verify your SHA membership at dispatch. Zero out-of-pocket payment for covered emergencies.' },
    { icon: FiClock,        title: 'what3words Addressing',     desc: 'In rural areas without street names, we pinpoint your exact location to a 3-metre square.' }
  ];

  return (
    <MainLayout>
      <HeroSection />

      {/* How it works */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-emergency-red text-xs uppercase tracking-widest font-medium">Process</span>
          <h2 className="text-4xl font-display text-ems-white mt-2">HOW IT WORKS</h2>
          <p className="text-ems-muted mt-3 max-w-xl mx-auto">Four steps from crisis to care. Designed for the Kenyan reality — urban congestion and rural distance alike.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map(({ step, title, desc }) => (
            <div key={step} className="ems-card group hover:border-emergency-red/30 transition-all">
              <div className="text-5xl font-display text-emergency-red/20 group-hover:text-emergency-red/40 transition-colors mb-4">{step}</div>
              <h3 className="text-ems-white font-semibold mb-2">{title}</h3>
              <p className="text-ems-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-ems-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emergency-red text-xs uppercase tracking-widest font-medium">Technology</span>
            <h2 className="text-4xl font-display text-ems-white mt-2">BUILT FOR KENYA'S REALITY</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 bg-ems-black border border-ems-border rounded-2xl hover:border-emergency-red/30 transition-all group">
                <div className="w-11 h-11 bg-emergency-red/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emergency-red/20 transition-colors">
                  <Icon size={20} className="text-emergency-red" />
                </div>
                <h3 className="text-ems-white font-semibold mb-2">{title}</h3>
                <p className="text-ems-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News — live from admin posts */}
      <LatestNews />

      {/* Gallery — photos & videos from admin posts */}
      <Gallery />

      {/* Membership preview */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-emergency-red text-xs uppercase tracking-widest font-medium">Membership</span>
          <h2 className="text-4xl font-display text-ems-white mt-2">FROM KES 4,000 / YEAR</h2>
          <p className="text-ems-muted mt-3 max-w-xl mx-auto">Pre-pay for peace of mind. No payment at the scene of a crisis. SHA ECCIF integrated.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MEMBERSHIP_PLANS.slice(0, 4).map(plan => (
            <div key={plan.type} className="ems-card hover:border-emergency-red/30 transition-all">
              <div className="text-3xl mb-3">{plan.icon}</div>
              <h3 className="text-ems-white font-semibold mb-1">{plan.label}</h3>
              <div className="text-emergency-red text-2xl font-display mb-3">KES {plan.price.toLocaleString()}</div>
              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-ems-muted text-xs">
                    <FiCheckCircle size={12} className="text-green-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/membership" className="btn-emergency inline-flex items-center gap-2 px-8 py-3.5">
            View All Plans <FiArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emergency-red/5 border border-emergency-red/20 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emergency-red/10 to-transparent" />
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-display text-ems-white mb-4">DON'T WAIT FOR A CRISIS</h2>
            <p className="text-ems-muted text-lg max-w-xl mx-auto mb-8">Join over 2 million Kenyans with guaranteed emergency cover. From KES 4,000 a year.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register" className="btn-emergency text-base py-4 px-8 flex items-center gap-2">
                Activate My Cover <FiArrowRight size={16} />
              </Link>
              <a href="tel:0757751980" className="btn-ghost text-base py-4 px-8">
                Call 0757751980
              </a>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
