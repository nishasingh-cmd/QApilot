import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          whileHover={{ scale: 1.1, boxShadow: '0 0 24px rgba(79,140,255,0.5)' }}
          whileTap={{ scale: 0.92 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-brand-blue border border-brand-blue/40 text-white shadow-lg shadow-brand-blue/30 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg transition-colors"
        >
          <ArrowUp size={18} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
