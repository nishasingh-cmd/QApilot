import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../common/Logo';
import { Container } from '../common/Container';
import { Button } from '../ui/Button';
import { Footer } from '../common/Footer';
import { ScrollToTop } from '../common/ScrollToTop';

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollDir, setScrollDir] = useState('up');
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if transparent or glassmorphic
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Determine scroll direction (hide on scroll down, show on scroll up)
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setScrollDir('down');
      } else {
        setScrollDir('up');
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text-primary">
      {/* Sticky, Hide/Show, Glassmorphic Navbar */}
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: -80 }
        }}
        animate={scrollDir === 'down' && !mobileMenuOpen ? 'hidden' : 'visible'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          sticky top-0 z-50 w-full h-20 flex items-center justify-between border-b transition-all duration-300
          ${isScrolled 
            ? 'bg-brand-bg/75 backdrop-blur-lg border-brand-border/80 shadow-lg shadow-black/20' 
            : 'bg-transparent border-transparent'
          }
        `}
      >
        <Container className="flex items-center justify-between">
          <Link to="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg">
            <Logo />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-[14px] font-medium text-brand-text-secondary hover:text-white transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-[14px] font-semibold text-brand-text-secondary hover:text-white">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm" className="text-[14px] font-semibold px-5">
                Start Free
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburguer Toggle Button */}
          <button 
            className="md:hidden p-2 text-brand-text-secondary hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </Container>
      </motion.header>

      {/* Mobile Animated Slide down Fullscreen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark background blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-20 z-40 bg-black/60 backdrop-blur-md md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="fixed top-20 left-0 right-0 z-45 md:hidden bg-brand-surface border-b border-brand-border px-6 py-8 flex flex-col gap-6 overflow-hidden shadow-2xl shadow-black/50"
            >
              <nav className="flex flex-col gap-5">
                {navLinks.map((link, idx) => (
                  <motion.a 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    key={link.name} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-semibold text-brand-text-secondary hover:text-white transition-colors py-1"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </nav>

              <div className="h-px bg-brand-border" />

              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-3"
              >
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="glass" className="w-full text-[14px]">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="primary" className="w-full text-[14px]">
                    Start Free
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main viewport */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating scroll-to-top button */}
      <ScrollToTop />
    </div>
  );
}
