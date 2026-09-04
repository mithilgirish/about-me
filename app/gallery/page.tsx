"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import * as THREE from 'three';
import { useInView } from 'react-intersection-observer';
import { Eye, Download, ExternalLink, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import CameraTransition from "@/components/CameraTransition";
import { triggerHaptic } from "@/lib/haptics";

const ITEMS_PER_PAGE = 12;

interface Photo {
  id: string;
  alt_description: string | null;
  description: string | null;
  urls: { small: string; regular: string; full: string };
  links: { html: string; download: string; download_location: string };
  statistics?: {
    downloads: { total: number };
    views: { total: number };
  };
}

interface UserStats {
  views: { total: number };
  downloads: { total: number };
}

interface SectionProps {
  children: React.ReactNode;
  id: string;
}

const Section: React.FC<SectionProps> = ({ children, id }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-16"
    >
      {children}
    </motion.section>
  );
};

// --- LIGHTBOX MODAL ---
const Lightbox: React.FC<{
  photo: Photo | null;
  hasPrev: boolean;
  hasNext: boolean;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}> = ({ photo, hasPrev, hasNext, currentIndex, totalCount, onClose, onNext, onPrev }) => {
  const [zoom, setZoom] = useState<number>(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const touchDistanceRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastTapRef = useRef<number>(0);

  const resetPosition = useCallback(() => {
    animate(x, 0, { type: "spring", stiffness: 400, damping: 35 });
    animate(y, 0, { type: "spring", stiffness: 400, damping: 35 });
  }, [x, y]);

  useEffect(() => {
    setZoom(1);
    x.set(0);
    y.set(0);
  }, [photo?.id, x, y]);

  useEffect(() => {
    if (zoom === 1) {
      resetPosition();
    } else {
      // If zoom decreases, ensure image position doesn't exceed new drag constraints
      const maxDragX = Math.round((zoom - 1) * 360);
      const maxDragY = Math.round((zoom - 1) * 260);
      if (Math.abs(x.get()) > maxDragX) {
        animate(x, Math.sign(x.get()) * maxDragX, { type: "spring", stiffness: 400, damping: 35 });
      }
      if (Math.abs(y.get()) > maxDragY) {
        animate(y, Math.sign(y.get()) * maxDragY, { type: "spring", stiffness: 400, damping: 35 });
      }
    }
  }, [zoom, resetPosition, x, y]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerHaptic("selection");
        onClose();
      }
      if (e.key === 'ArrowRight' && hasNext) {
        triggerHaptic("selection");
        onNext();
      }
      if (e.key === 'ArrowLeft' && hasPrev) {
        triggerHaptic("selection");
        onPrev();
      }
      if (e.key === '+' || e.key === '=') {
        triggerHaptic("light");
        setZoom(z => Math.min(3.5, +(z + 0.5).toFixed(1)));
      }
      if (e.key === '-' || e.key === '_') {
        triggerHaptic("light");
        setZoom(z => Math.max(1, +(z - 0.5).toFixed(1)));
      }
      if (e.key === '0') {
        triggerHaptic("medium");
        setZoom(1);
        resetPosition();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev, resetPosition]);

  // Double-click to toggle zoom on desktop
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("medium");
    if (zoom > 1) {
      setZoom(1);
      resetPosition();
    } else {
      setZoom(2);
    }
  };

  // Mouse wheel zoom on web
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.002;
    setZoom(prev => {
      const next = Math.min(3.5, Math.max(1, +(prev + delta).toFixed(2)));
      if (next === 1) resetPosition();
      return next;
    });
  };

  // Touch handlers for mobile: pinch-to-zoom, double-tap, and swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Two-finger pinch start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
      return;
    }

    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        // Double-tap detected
        e.preventDefault();
        triggerHaptic("medium");
        if (zoom > 1) {
          setZoom(1);
          resetPosition();
        } else {
          setZoom(2);
        }
      }
      lastTapRef.current = now;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      // Pinch to zoom scaling
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const diff = (dist - touchDistanceRef.current) * 0.007;
      setZoom(z => {
        const next = Math.min(3.5, Math.max(1, +(z + diff).toFixed(2)));
        if (next === 1) resetPosition();
        return next;
      });
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchDistanceRef.current = null;
    // Horizontal swipe navigation when not zoomed
    if (zoom === 1 && touchStartRef.current && e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
        if (deltaX < 0 && hasNext) {
          triggerHaptic("selection");
          onNext();
        } else if (deltaX > 0 && hasPrev) {
          triggerHaptic("selection");
          onPrev();
        }
      }
    }
    touchStartRef.current = null;
  };

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/95 z-[9999] flex flex-col justify-between select-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Top Control Header Bar */}
        <div className="w-full px-3 sm:px-6 py-3 flex items-center justify-between z-40 bg-gradient-to-b from-black/90 via-black/60 to-transparent gap-2 pointer-events-auto">
          {/* Index Counter Pill */}
          <div className="flex items-center px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-xl shadow-md">
            <span className="text-white/90 font-mono text-xs font-semibold tracking-wide">
              {currentIndex >= 0 ? `${currentIndex + 1} / ${totalCount}` : photo.id}
            </span>
          </div>

          {/* Zoom & Action Controls */}
          <div className="flex items-center gap-1.5 bg-white/[0.08] px-2.5 py-1 rounded-full border border-white/15 backdrop-blur-xl shadow-md">
            <button
              className="p-1 rounded-full hover:bg-white/20 text-white disabled:opacity-30 transition-all active:scale-90"
              data-cursor-mode="zoom-out"
              onClick={() => {
                triggerHaptic("light");
                setZoom(z => {
                  const next = Math.max(1, +(z - 0.5).toFixed(1));
                  if (next === 1) resetPosition();
                  return next;
                });
              }}
              disabled={zoom <= 1}
              aria-label="Zoom out"
            >
              <ZoomOut size={15} />
            </button>
            <span className="text-xs font-mono text-white/95 min-w-[38px] text-center select-none font-semibold">
              {Math.round(zoom * 100)}%
            </span>
            <button
              className="p-1 rounded-full hover:bg-white/20 text-white disabled:opacity-30 transition-all active:scale-90"
              data-cursor-mode="zoom-in"
              onClick={() => {
                triggerHaptic("light");
                setZoom(z => Math.min(3.5, +(z + 0.5).toFixed(1)));
              }}
              disabled={zoom >= 3.5}
              aria-label="Zoom in"
            >
              <ZoomIn size={15} />
            </button>
            {zoom > 1 && (
              <button
                className="p-1 rounded-full hover:bg-white/20 text-cyan-300 transition-all ml-0.5 active:scale-90"
                onClick={() => {
                  triggerHaptic("medium");
                  setZoom(1);
                  resetPosition();
                }}
                aria-label="Reset zoom"
                title="Reset zoom"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            className="p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.2] text-white transition-all border border-white/15 backdrop-blur-xl shadow-md active:scale-90"
            onClick={() => {
              triggerHaptic("selection");
              onClose();
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Center Stage / Image Viewport */}
        <div
          className="flex-1 w-full relative flex items-center justify-center overflow-hidden p-2 sm:p-4 touch-none"
          onClick={() => {
            if (zoom === 1) {
              triggerHaptic("selection");
              onClose();
            }
          }}
        >
          {/* Desktop/Tablet Left Navigation Arrow */}
          {hasPrev && zoom === 1 && (
            <motion.button
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3.5 z-30 rounded-full bg-white/[0.08] hover:bg-white/[0.2] border border-white/20 backdrop-blur-xl transition-all shadow-xl active:scale-95"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic("selection");
                onPrev();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </motion.button>
          )}

          {/* Desktop/Tablet Right Navigation Arrow */}
          {hasNext && zoom === 1 && (
            <motion.button
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3.5 z-30 rounded-full bg-white/[0.08] hover:bg-white/[0.2] border border-white/20 backdrop-blur-xl transition-all shadow-xl active:scale-95"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic("selection");
                onNext();
              }}
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </motion.button>
          )}

          {/* Interactive Zoomable & Pannable Image Canvas */}
          <motion.div
            key={photo.id}
            data-cursor-mode={zoom > 1 ? "grab" : "zoom-in"}
            drag={zoom > 1}
            dragConstraints={{
              left: -Math.round((zoom - 1) * 360),
              right: Math.round((zoom - 1) * 360),
              top: -Math.round((zoom - 1) * 260),
              bottom: Math.round((zoom - 1) * 260),
            }}
            dragElastic={0.15}
            animate={{ scale: zoom }}
            transition={{ type: "spring", stiffness: 350, damping: 32 }}
            whileDrag={{ cursor: "grabbing" }}
            style={{
              x,
              y,
              cursor: zoom > 1 ? "grab" : "zoom-in",
              touchAction: zoom > 1 ? "none" : "auto",
            }}
            className="relative flex items-center justify-center max-w-full max-h-full will-change-transform select-none"
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={handleDoubleClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            <img
              src={photo.urls.full}
              alt={photo.alt_description || 'Photography by Mithil Girish'}
              className="max-h-[calc(100vh-175px)] sm:max-h-[calc(100vh-155px)] max-w-[96vw] sm:max-w-[88vw] object-contain rounded-xl shadow-2xl pointer-events-none select-none"
              draggable={false}
            />
          </motion.div>
        </div>

        {/* Bottom Action Footer Bar */}
        <div className="w-full px-3 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-t from-black/95 via-black/75 to-transparent z-40 border-t border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 pointer-events-auto">
          <div className="flex flex-col text-left max-w-md w-full sm:w-auto">
            <p className="text-white text-xs sm:text-sm font-medium capitalize tracking-wide truncate">
              {photo.alt_description || 'Photography by Mithil Girish'}
            </p>
            {photo.statistics && (
              <div className="flex gap-4 mt-1 text-[11px] sm:text-xs text-white/70 font-sans">
                <span className="flex items-center gap-1.5">
                  <Eye size={13} className="text-cyan-400" /> {photo.statistics.views.total.toLocaleString()} views
                </span>
                <span className="flex items-center gap-1.5">
                  <Download size={13} className="text-emerald-400" /> {photo.statistics.downloads.total.toLocaleString()} downloads
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 sm:gap-3 text-xs font-sans w-full sm:w-auto justify-end">
            <a
              href={photo.links.html}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/20 font-medium backdrop-blur-md active:scale-95"
              onClick={() => triggerHaptic("medium")}
            >
              <ExternalLink size={13} />
              <span>Unsplash</span>
            </a>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium rounded-xl transition-all border border-zinc-700 shadow-md backdrop-blur-md hover:scale-[1.02] active:scale-[0.96]"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                triggerHaptic("medium");

                // Trigger Unsplash API download location ping
                axios.get(photo.links.download_location, {
                  headers: { Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}` }
                }).catch(() => {});

                try {
                  const response = await fetch(photo.urls.full);
                  const blob = await response.blob();
                  const blobUrl = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = blobUrl;
                  link.download = `mithilgirish-${photo.id}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(blobUrl);
                } catch {
                  window.open(photo.urls.full, '_blank');
                }
              }}
            >
              <Download size={14} className="text-zinc-300" />
              <span className="tracking-wide">Download Image</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fetchPhotos = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`https://api.unsplash.com/users/mithilgirish/photos`, {
        params: { page, per_page: ITEMS_PER_PAGE, order_by: 'views', stats: true },
        headers: { Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}` },
      });
      setPhotos(res.data);
      const total = parseInt(res.headers['x-total'] || '0');
      setTotalPages(total > 0 ? Math.ceil(total / ITEMS_PER_PAGE) : parseInt(res.headers['x-total-pages'] || '10'));
    } catch (err) {
      console.error("Error fetching photos:", err);
      setError("Failed to fetch photos. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await axios.get(`https://api.unsplash.com/users/mithilgirish/statistics`, {
          headers: { Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}` },
        });
        setUserStats(res.data);
      } catch { /* Silent fail */ }
    };
    fetchUserStats();
    fetchPhotos(1);
  }, [fetchPhotos]);

  // Three.js starfield
  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1200;
    const positionArray = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) positionArray[i] = (Math.random() - 0.5) * 2000;
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    const starsMaterial = new THREE.PointsMaterial({ size: 1.5, color: 0xffffff, transparent: true, opacity: 0.75 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    camera.position.z = 10;

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      stars.rotation.y += 0.0003;
      stars.rotation.x += 0.00015;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
    };
  }, []);

  // Transition state (runs ONCE on initial page entry to /gallery)
  const [isTransitioning, setIsTransitioning] = useState(true);

  const triggerPageChange = (newPage: number) => {
    if (newPage === currentPage) return;
    setCurrentPage(newPage);
    fetchPhotos(newPage);
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
  };

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  const navigateLightbox = (direction: 'next' | 'prev') => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    if (direction === 'next' && currentIndex < photos.length - 1) setSelectedPhoto(photos[currentIndex + 1]);
    else if (direction === 'prev' && currentIndex > 0) setSelectedPhoto(photos[currentIndex - 1]);
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-white selection:text-black">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />

      {/* Camera transition */}
      <CameraTransition
        isActive={isTransitioning}
        onComplete={handleTransitionComplete}
        frameCount={currentPage}
      />

      {/* Lightbox */}
      {selectedPhoto && (() => {
        const selectedIndex = photos.findIndex(p => p.id === selectedPhoto.id);
        const hasPrev = selectedIndex > 0;
        const hasNext = selectedIndex >= 0 && selectedIndex < photos.length - 1;
        return (
          <Lightbox
            photo={selectedPhoto}
            hasPrev={hasPrev}
            hasNext={hasNext}
            currentIndex={selectedIndex}
            totalCount={photos.length}
            onClose={closeLightbox}
            onNext={() => navigateLightbox('next')}
            onPrev={() => navigateLightbox('prev')}
          />
        );
      })()}

      {/* Main Gallery Content */}
      <main className="relative z-10 pt-16 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl" ref={scrollRef}>

          {/* INTRO SECTION */}
          <Section id="gallery-intro">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4 text-left">
              <div>
                <motion.h1
                  className="text-5xl md:text-7xl font-bold mb-3 bg-gradient-to-r from-[#EBF4F5] to-[#B5C6E0] bg-clip-text text-transparent tracking-tight leading-[1.15] pb-4 pt-1 inline-block"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Gallery
                </motion.h1>
                <p className="text-gray-300 text-base font-light max-w-2xl">
                  Explore high-resolution photography capturing geometry, ambient optics, and modern architectural perspectives.
                </p>
              </div>

              {userStats && (
                <motion.div
                  className="flex gap-6 font-mono border border-white/10 p-3.5 rounded-xl bg-white/[0.02] backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <div className="flex flex-col text-left">
                    <span className="text-xl text-white font-bold">{userStats.views.total.toLocaleString()}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Total Views</span>
                  </div>
                  <div className="w-[1px] bg-white/10"></div>
                  <div className="flex flex-col text-left">
                    <span className="text-xl text-white font-bold">{userStats.downloads.total.toLocaleString()}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Downloads</span>
                  </div>
                </motion.div>
              )}
            </div>
          </Section>

          {/* ERROR or LOADING or GRID */}
          {error ? (
            <div className="text-center text-red-400 font-mono py-16 border border-red-500/20 rounded-xl bg-red-500/5">
              {error}
            </div>
          ) : isLoading ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <div key={index} className="break-inside-avoid mb-6">
                  <Skeleton className="w-full h-72 rounded-xl bg-zinc-900/60 border border-zinc-800" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* MASONRY PHOTO GRID */}
              <Section id="photo-grid">
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                  {photos.length > 0 ? (
                    photos.map((photo, index) => (
                      <motion.div
                        key={photo.id}
                        data-cursor-mode="zoom-in"
                        className="break-inside-avoid mb-6 rounded-xl overflow-hidden shadow-2xl cursor-pointer group border border-white/10 hover:border-white/30 transition-all relative bg-slate-950"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -3 }}
                        onClick={() => openLightbox(photo)}
                      >
                        <div className="relative">
                          <img
                            src={photo.urls.regular}
                            alt={photo.alt_description || 'Photo'}
                            loading="lazy"
                            className="object-cover w-full transition-transform duration-500 group-hover:scale-105"
                          />

                          {/* Hover Details Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left">
                            <span className="text-white text-xs font-medium mb-1 font-sans">
                              {photo.alt_description || 'Photography by Mithil Girish'}
                            </span>
                            {photo.statistics && (
                              <div className="flex gap-3 text-[11px] font-mono text-white/70">
                                <span className="flex items-center gap-1.5"><Eye size={12} className="text-cyan-400" /> {photo.statistics.views.total.toLocaleString()}</span>
                                <span className="flex items-center gap-1.5"><Download size={12} className="text-emerald-400" /> {photo.statistics.downloads.total.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center font-mono text-slate-400 py-12">No images found.</p>
                  )}
                </div>
              </Section>

              {/* PAGINATION */}
              <Section id="pagination">
                <div className="mt-8 flex flex-col justify-center gap-4 items-center text-sm">
                  <div className="flex gap-2 justify-center flex-wrap">
                    <motion.button
                      key={1}
                      onClick={() => triggerPageChange(1)}
                      className={`px-3.5 py-1.5 rounded-lg border transition-all font-sans ${
                        currentPage === 1
                          ? 'bg-white text-black border-white font-semibold'
                          : 'bg-white/5 text-white/70 border-white/15 hover:border-white/40'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      1
                    </motion.button>

                    {currentPage > 4 && <span className="text-white/40 px-1 self-center">...</span>}

                    {Array.from({ length: 5 }, (_, index) => {
                      const actualPage = currentPage - 2 + index;
                      if (actualPage > 1 && actualPage < totalPages) {
                        return (
                          <motion.button
                            key={actualPage}
                            onClick={() => triggerPageChange(actualPage)}
                            className={`px-3.5 py-1.5 rounded-lg border transition-all font-sans ${
                              currentPage === actualPage
                                ? 'bg-white text-black border-white font-semibold'
                                : 'bg-white/5 text-white/70 border-white/15 hover:border-white/40'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {actualPage}
                          </motion.button>
                        );
                      }
                      return null;
                    })}

                    {currentPage < totalPages - 3 && <span className="text-white/40 px-1 self-center">...</span>}

                    {totalPages > 1 && (
                      <motion.button
                        key={totalPages}
                        onClick={() => triggerPageChange(totalPages)}
                        className={`px-3.5 py-1.5 rounded-lg border transition-all font-sans ${
                          currentPage === totalPages
                            ? 'bg-white text-black border-white font-semibold'
                            : 'bg-white/5 text-white/70 border-white/15 hover:border-white/40'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {totalPages}
                      </motion.button>
                    )}
                  </div>

                  <div className="flex justify-between gap-3 w-full max-w-xs pt-2">
                    {currentPage > 1 && (
                      <motion.button
                        onClick={() => triggerPageChange(currentPage - 1)}
                        className="w-full py-2 px-4 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all font-sans"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        ← Previous
                      </motion.button>
                    )}

                    {currentPage < totalPages && (
                      <motion.button
                        onClick={() => triggerPageChange(currentPage + 1)}
                        className="w-full py-2 px-4 rounded-lg bg-white text-black font-semibold hover:bg-slate-200 transition-all font-sans"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Next →
                      </motion.button>
                    )}
                  </div>
                </div>
              </Section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Gallery;