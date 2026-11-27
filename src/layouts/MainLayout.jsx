
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * ============================================================
 * EMS KENYA — MAIN APPLICATION LAYOUT
 * Professional White Theme | Responsive Design
 * ============================================================
 */

export default function MainLayout({ children }) {
  return (
    <div className="
      min-h-screen
      w-full
      flex
      flex-col
      overflow-x-hidden
      bg-white
      text-slate-800
      antialiased
    ">
      {/* ======================================================
          GLOBAL NAVIGATION
      ====================================================== */}

      <Navbar />

      {/* ======================================================
          MAIN PAGE CONTENT
      ====================================================== */}

      <main
        id="main-content"
        className="
          relative
          flex-1
          w-full
          min-w-0
          pt-[72px]
          bg-white
          text-slate-800
        "
      >
        {children}
      </main>

      {/* ======================================================
          GLOBAL FOOTER
      ====================================================== */}

      <Footer />
    </div>
  );
}