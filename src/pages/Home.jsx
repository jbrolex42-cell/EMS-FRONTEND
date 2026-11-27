
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/HeroSection';
import api from '../services/api';
import { timeAgo } from '../utils/formatTime';
import {
  FiArrowRight,
  FiCheckCircle,
  FiActivity,
  FiShield,
  FiMapPin,
  FiClock,
  FiZap,
  FiPlay,
  FiImage,
  FiCalendar,
  FiX,
} from 'react-icons/fi';
import { MEMBERSHIP_PLANS } from '../utils/constants';

// ============================================================
// LIGHTBOX
// ============================================================

function Lightbox({ post, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-slate-950/80
        backdrop-blur-sm
        p-4
      "
      onClick={onClose}
      role="presentation"
    >
      <div
        className="
          relative w-full max-w-3xl
          overflow-hidden
          rounded-2xl
          border border-slate-200
          bg-white
          shadow-2xl
        "
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close media viewer"
          className="
            absolute right-4 top-4 z-10
            flex h-9 w-9 items-center justify-center
            rounded-full
            bg-slate-950/70
            text-white
            transition-colors
            hover:bg-red-600
          "
        >
          <FiX size={17} />
        </button>

        {post.type === 'video' && post.mediaUrl ? (
          <video
            src={post.mediaUrl}
            controls
            autoPlay
            className="
              max-h-[60vh] w-full
              bg-black object-contain
            "
          />
        ) : post.mediaUrl ? (
          <img
            src={post.mediaUrl}
            alt={post.title}
            className="
              max-h-[60vh] w-full
              bg-black object-contain
            "
          />
        ) : null}

        <div className="p-5">
          <h3 className="mb-2 font-semibold text-slate-900">
            {post.title}
          </h3>

          {post.summary && (
            <p className="text-sm leading-relaxed text-slate-600">
              {post.summary}
            </p>
          )}

          <p className="mt-3 text-xs text-slate-500">
            {timeAgo(post.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LATEST NEWS
// ============================================================

function LatestNews() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .get('/updates?limit=3&type=news')
      .then((response) => {
        if (active) {
          setPosts(response.data.posts || []);
        }
      })
      .catch(() => {
        if (active) {
          setPosts([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading || posts.length >= 3) {
      return;
    }

    let active = true;

    api
      .get('/updates?limit=6')
      .then((response) => {
        if (!active) return;

        const allPosts = response.data.posts || [];

        const newsAndArticles = allPosts.filter(
          (post) =>
            post.type === 'news' ||
            post.type === 'article'
        );

        setPosts(newsAndArticles.slice(0, 3));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [loading, posts.length]);

  if (!loading && posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="
              text-xs font-bold uppercase
              tracking-[0.2em] text-red-600
            ">
              Latest
            </span>

            <h2 className="
              mt-2 text-3xl font-display
              text-slate-900 sm:text-4xl
            ">
              EMS NEWS & UPDATES
            </h2>
          </div>

          <Link
            to="/updates"
            className="
              group flex shrink-0 items-center gap-2
              text-sm font-semibold text-slate-600
              transition-colors hover:text-red-600
            "
          >
            View all
            <FiArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  overflow-hidden rounded-2xl
                  border border-slate-200
                  bg-white p-5
                  shadow-sm
                  animate-pulse
                "
              >
                <div className="mb-5 h-40 rounded-xl bg-slate-100" />
                <div className="mb-3 h-4 w-3/4 rounded bg-slate-100" />
                <div className="h-3 w-1/2 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                to="/updates"
                key={post._id}
                className="
                  group flex flex-col
                  overflow-hidden rounded-2xl
                  border border-slate-200
                  bg-white p-5
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-red-200
                  hover:shadow-lg
                "
              >
                {post.mediaUrl && (
                  <div className="
                    -mx-5 -mt-5 mb-5
                    h-44 overflow-hidden
                    bg-slate-100
                  ">
                    <img
                      src={post.mediaUrl}
                      alt={post.title}
                      className="
                        h-full w-full object-cover
                        transition-transform duration-500
                        group-hover:scale-105
                      "
                    />
                  </div>
                )}

                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="
                    rounded-full border border-blue-100
                    bg-blue-50 px-3 py-1
                    text-xs font-semibold capitalize
                    text-blue-700
                  ">
                    {post.type}
                  </span>

                  <span className="
                    flex items-center gap-1
                    text-xs text-slate-500
                  ">
                    <FiCalendar size={12} />
                    {timeAgo(post.createdAt)}
                  </span>
                </div>

                <h3 className="
                  mb-2 flex-1
                  text-sm font-bold leading-relaxed
                  text-slate-900
                  transition-colors
                  group-hover:text-red-600
                  line-clamp-2
                ">
                  {post.title}
                </h3>

                {post.summary && (
                  <p className="
                    text-xs leading-relaxed
                    text-slate-600 line-clamp-2
                  ">
                    {post.summary}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// PHOTO AND VIDEO GALLERY
// ============================================================

function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get('/updates?limit=6&type=photo'),
      api.get('/updates?limit=6&type=video'),
    ])
      .then(([photos, videos]) => {
        if (!active) return;

        const allItems = [
          ...(photos.data.posts || []),
          ...(videos.data.posts || []),
        ]
          .sort(
            (a, b) =>
              new Date(b.createdAt) - new Date(a.createdAt)
          )
          .slice(0, 8);

        setItems(allItems);
      })
      .catch(() => {
        if (active) {
          setItems([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      {selected && (
        <Lightbox
          post={selected}
          onClose={() => setSelected(null)}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="
              text-xs font-bold uppercase
              tracking-[0.2em] text-red-600
            ">
              Media
            </span>

            <h2 className="
              mt-2 text-3xl font-display
              text-slate-900 sm:text-4xl
            ">
              PHOTOS & VIDEOS
            </h2>
          </div>

          <Link
            to="/updates?type=photo"
            className="
              group flex shrink-0 items-center gap-2
              text-sm font-semibold text-slate-600
              transition-colors hover:text-red-600
            "
          >
            View gallery
            <FiArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {loading ? (
          <div className="
            grid grid-cols-2 gap-3
            sm:grid-cols-3 lg:grid-cols-4
          ">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="
                  aspect-square animate-pulse
                  rounded-2xl bg-slate-200
                "
              />
            ))}
          </div>
        ) : (
          <div className="
            grid grid-cols-2 gap-3
            sm:grid-cols-3 lg:grid-cols-4
          ">
            {items.map((item, index) => (
              <button
                type="button"
                key={item._id}
                onClick={() => setSelected(item)}
                aria-label={`View ${item.type}: ${item.title}`}
                className={`
                  group relative block
                  aspect-square overflow-hidden
                  rounded-2xl border border-slate-200
                  bg-white text-left
                  transition-all duration-300
                  hover:border-red-400 hover:shadow-lg
                  focus:outline-none focus:ring-2
                  focus:ring-red-500 focus:ring-offset-2
                  ${
                    index === 0
                      ? 'col-span-2 row-span-2'
                      : ''
                  }
                `}
              >
                {item.mediaUrl ? (
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    loading="lazy"
                    className="
                      h-full w-full object-cover
                      transition-transform duration-500
                      group-hover:scale-105
                    "
                  />
                ) : (
                  <div className="
                    flex h-full w-full items-center
                    justify-center bg-slate-100
                  ">
                    <FiImage
                      size={28}
                      className="text-slate-400"
                    />
                  </div>
                )}

                <div className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-slate-950/80
                  via-transparent to-transparent
                  opacity-0 transition-opacity
                  group-hover:opacity-100
                " />

                {item.type === 'video' && (
                  <div className="
                    absolute inset-0
                    flex items-center justify-center
                  ">
                    <div className="
                      flex h-12 w-12 items-center
                      justify-center rounded-full
                      bg-red-600 text-white
                      shadow-lg shadow-red-900/30
                      transition-transform
                      group-hover:scale-110
                    ">
                      <FiPlay size={18} className="ml-0.5" />
                    </div>
                  </div>
                )}

                <div className="
                  absolute bottom-0 left-0 right-0
                  translate-y-2 p-3
                  opacity-0 transition-all duration-200
                  group-hover:translate-y-0
                  group-hover:opacity-100
                ">
                  <p className="
                    text-xs font-semibold leading-relaxed
                    text-white line-clamp-2
                  ">
                    {item.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// HOMEPAGE
// ============================================================

export default function Home() {
  const howItWorks = [
    {
      step: '01',
      title: 'Tap SOS or Call',
      desc: 'One tap on the app, USSD *888#, or call 0700 395 395. Works on any phone, any network.',
    },
    {
      step: '02',
      title: 'AI Triage & Dispatch',
      desc: 'Our AI assesses your emergency in Swahili or English and dispatches the closest, most equipped responder in seconds.',
    },
    {
      step: '03',
      title: 'Responder En Route',
      desc: 'Track your ambulance or motorcycle EMT live on the map. Get real-time ETA and responder details.',
    },
    {
      step: '04',
      title: 'SHA-Covered Care',
      desc: 'Our EMTs stabilize you on scene. SHA ECCIF covers the cost — no payment at the point of crisis.',
    },
  ];

  const features = [
    {
      icon: FiZap,
      title: 'Sub-13 Minute Urban ETA',
      desc: 'GPS-optimized dispatch gets you the nearest available unit — not just the nearest provider.',
    },
    {
      icon: FiMapPin,
      title: '47-County Coverage',
      desc: 'ALS ambulances, BLS units, and motorcycle first responders across Kenya, including Turkana and Garissa.',
    },
    {
      icon: FiShield,
      title: 'KMPDC Certified EMTs',
      desc: 'Every responder holds active KMPDC registration and BLS/ALS certification. No gig-economy shortcuts.',
    },
    {
      icon: FiActivity,
      title: 'AI Voice Triage',
      desc: 'NLP triage in Swahili and English assesses severity and guides bystanders in real time before help arrives.',
    },
    {
      icon: FiCheckCircle,
      title: 'SHA ECCIF Integrated',
      desc: 'Seamlessly verify your SHA membership at dispatch. Zero out-of-pocket payment for covered emergencies.',
    },
    {
      icon: FiClock,
      title: 'what3words Addressing',
      desc: 'In rural areas without street names, we pinpoint your exact location to a 3-metre square.',
    },
  ];

  return (
    <MainLayout>
      <HeroSection />

      {/* HOW IT WORKS */}

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-14 text-center sm:mb-16">
            <span className="
              text-xs font-bold uppercase
              tracking-[0.2em] text-red-600
            ">
              Process
            </span>

            <h2 className="
              mt-3 text-3xl font-display
              text-slate-900 sm:text-4xl
            ">
              HOW IT WORKS
            </h2>

            <p className="
              mx-auto mt-4 max-w-2xl
              text-sm leading-7 text-slate-600 sm:text-base
            ">
              Four steps from crisis to care. Designed for the
              Kenyan reality — urban congestion and rural
              distance alike.
            </p>
          </div>

          <div className="
            grid gap-6
            md:grid-cols-2 lg:grid-cols-4
          ">
            {howItWorks.map(({ step, title, desc }) => (
              <div
                key={step}
                className="
                  group rounded-2xl
                  border border-slate-200
                  bg-white p-6
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-red-200
                  hover:shadow-lg
                "
              >
                <div className="
                  mb-4 font-display text-5xl
                  text-red-200 transition-colors
                  group-hover:text-red-500
                ">
                  {step}
                </div>

                <h3 className="
                  mb-3 font-bold text-slate-900
                ">
                  {title}
                </h3>

                <p className="
                  text-sm leading-7 text-slate-600
                ">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-14 text-center sm:mb-16">
            <span className="
              text-xs font-bold uppercase
              tracking-[0.2em] text-red-600
            ">
              Technology
            </span>

            <h2 className="
              mt-3 text-3xl font-display
              text-slate-900 sm:text-4xl
            ">
              BUILT FOR KENYA'S REALITY
            </h2>
          </div>

          <div className="
            grid gap-6
            md:grid-cols-2 lg:grid-cols-3
          ">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="
                  group rounded-2xl
                  border border-slate-200
                  bg-white p-6
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-red-200
                  hover:shadow-lg
                "
              >
                <div className="
                  mb-5 flex h-12 w-12
                  items-center justify-center
                  rounded-xl bg-red-50
                  transition-colors
                  group-hover:bg-red-100
                ">
                  <Icon
                    size={22}
                    className="text-red-600"
                  />
                </div>

                <h3 className="
                  mb-3 font-bold text-slate-900
                ">
                  {title}
                </h3>

                <p className="
                  text-sm leading-7 text-slate-600
                ">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST NEWS */}

      <LatestNews />

      {/* GALLERY */}

      <Gallery />

      {/* MEMBERSHIP PLANS */}

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-14 text-center sm:mb-16">
            <span className="
              text-xs font-bold uppercase
              tracking-[0.2em] text-red-600
            ">
              Membership
            </span>

            <h2 className="
              mt-3 text-3xl font-display
              text-slate-900 sm:text-4xl
            ">
              FROM KES 4,000 / YEAR
            </h2>

            <p className="
              mx-auto mt-4 max-w-xl
              text-sm leading-7 text-slate-600 sm:text-base
            ">
              Pre-pay for peace of mind. No payment at the
              scene of a crisis. SHA ECCIF integrated.
            </p>
          </div>

          <div className="
            grid gap-5
            sm:grid-cols-2 lg:grid-cols-4
          ">
            {MEMBERSHIP_PLANS.slice(0, 4).map((plan) => (
              <div
                key={plan.type}
                className="
                  rounded-2xl
                  border border-slate-200
                  bg-white p-6
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-red-200
                  hover:shadow-lg
                "
              >
                <div className="mb-4 text-3xl">
                  {plan.icon}
                </div>

                <h3 className="
                  mb-2 font-bold text-slate-900
                ">
                  {plan.label}
                </h3>

                <div className="
                  mb-5 font-display text-2xl
                  text-red-600
                ">
                  KES {plan.price.toLocaleString()}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="
                        flex items-start gap-2
                        text-xs leading-relaxed
                        text-slate-600
                      "
                    >
                      <FiCheckCircle
                        size={14}
                        className="
                          mt-0.5 shrink-0
                          text-green-600
                        "
                      />

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/membership"
              className="
                inline-flex items-center gap-2
                rounded-xl bg-red-600
                px-8 py-4
                text-sm font-bold text-white
                shadow-lg shadow-red-600/20
                transition-all
                hover:-translate-y-0.5
                hover:bg-red-700
                hover:shadow-xl
              "
            >
              View All Plans
              <FiArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}

      <section className="bg-white px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <div className="
          relative mx-auto max-w-7xl
          overflow-hidden rounded-3xl
          border border-red-100
          bg-red-50 px-6 py-16
          text-center sm:px-12 sm:py-20
        ">
          <div className="
            pointer-events-none absolute
            -right-20 -top-20
            h-72 w-72 rounded-full
            bg-red-200/30 blur-3xl
          " />

          <div className="
            pointer-events-none absolute
            -bottom-20 -left-20
            h-72 w-72 rounded-full
            bg-red-200/30 blur-3xl
          " />

          <div className="relative">
            <h2 className="
              mb-5 text-3xl font-display
              text-slate-900 sm:text-5xl
            ">
              DON'T WAIT FOR A CRISIS
            </h2>

            <p className="
              mx-auto mb-9 max-w-xl
              text-base leading-7 text-slate-600
            ">
              Join over 2 million Kenyans with guaranteed
              emergency cover. From KES 4,000 a year.
            </p>

            <div className="
              flex flex-wrap justify-center gap-4
            ">
              <Link
                to="/register"
                className="
                  inline-flex items-center gap-2
                  rounded-xl bg-red-600
                  px-8 py-4
                  text-sm font-bold text-white
                  shadow-lg shadow-red-600/20
                  transition-all
                  hover:-translate-y-0.5
                  hover:bg-red-700
                "
              >
                Activate My Cover
                <FiArrowRight size={17} />
              </Link>

              <a
                href="tel:0757751980"
                className="
                  inline-flex items-center justify-center
                  rounded-xl border border-slate-300
                  bg-white px-8 py-4
                  text-sm font-bold text-slate-800
                  transition-all
                  hover:border-red-300
                  hover:bg-red-50
                  hover:text-red-700
                "
              >
                Call 0757751980
              </a>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}