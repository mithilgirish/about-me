"use client";

import { Skeleton } from "@/components/ui/skeleton"
import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useInView } from 'react-intersection-observer';

const ITEMS_PER_PAGE = 10;

interface Photo {
  id: string;
  alt_description: string | null;
  description: string | null;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  links: {
    html: string;
    download: string;
  };
}

interface SectionProps {
  children: React.ReactNode;
  id: string;
}

const Section: React.FC<SectionProps> = ({ children, id }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
  });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="mb-20"
    >
      {children}
    </motion.section>
  );
};

// Lightbox Modal Component
const Lightbox: React.FC<{
  photo: Photo | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}> = ({ photo, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white/70 hover:text-white z-50 p-2"
          onClick={onClose}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation arrows */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 z-50"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 z-50"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Image container */}
        <motion.div
          className="max-w-5xl max-h-[85vh] relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={photo.urls.full}
            alt={photo.alt_description || 'Photography by Mithil Girish'}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />

          {/* Action buttons */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg flex justify-between items-center">
            <p className="text-white/80 text-sm">
              {photo.alt_description || 'Photography by Mithil Girish'}
            </p>
            <div className="flex gap-3">
              <a
                href={photo.links.html}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.5 6.75V0H2.25L7.5 6.75zM9.75 0v6.75H17.25L9.75 0zM7.5 8.25V24H17.25V8.25H7.5zM0 8.25V24H6v-15.75H0zM19.5 8.25V24H24V8.25H19.5z" />
                </svg>
                View on Unsplash
              </a>
              <a
                href={`${photo.links.download}?force=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
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
        params: {
          page: page,
          per_page: ITEMS_PER_PAGE,
          order_by: 'views',
        },
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        },
      });
      setPhotos(res.data);
      // Use x-total header to calculate actual pages
      const total = parseInt(res.headers['x-total'] || '0');
      setTotalPages(total > 0 ? Math.ceil(total / ITEMS_PER_PAGE) : parseInt(res.headers['x-total-pages'] || '10'));
    } catch (error) {
      console.error("Error fetching photos:", error);
      setError("Failed to fetch photos. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos(currentPage);
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage, fetchPhotos]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Create enhanced stars geometry
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positionArray = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      positionArray[i * 3] = (Math.random() - 0.5) * 2000;
      positionArray[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positionArray[i * 3 + 2] = (Math.random() - 0.5) * 2000;
      sizes[i] = Math.random() * 2 + 0.5;
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );
    starsGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(sizes, 1)
    );

    // Enhanced color palette for stars
    const colors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const colorType = Math.random();
      let r, g, b;

      if (colorType < 0.7) {
        r = 0.8 + Math.random() * 0.2;
        g = 0.8 + Math.random() * 0.2;
        b = 1.0;
      } else if (colorType < 0.9) {
        r = 0.8 + Math.random() * 0.2;
        g = 0.4 + Math.random() * 0.3;
        b = 1.0;
      } else {
        r = 1.0;
        g = 0.8 + Math.random() * 0.2;
        b = 0.4 + Math.random() * 0.3;
      }

      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    camera.position.z = 10;

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      stars.rotation.y += 0.001 + mouseX * 0.0005;
      stars.rotation.x += 0.0005 + mouseY * 0.0003;
      stars.position.y = Math.sin(Date.now() * 0.0005) * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
    };
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
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
    if (direction === 'next' && currentIndex < photos.length - 1) {
      setSelectedPhoto(photos[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      setSelectedPhoto(photos[currentIndex - 1]);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <main className="relative z-10">
      <div className="max-w-screen-xl mx-auto p-6">
        <Section id="gallery-intro">
          <Skeleton className="h-16 w-48 bg-gray-700/50" />
        </Section>
        <Section id="photo-grid">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <div key={index} className="break-inside-avoid mb-4">
                <Skeleton className="w-full h-64 rounded-lg bg-gray-700/50" />
              </div>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className="text-center text-red-500 relative z-10 pt-20">Error: {error}</div>
  );

  return (
    <>
      <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
        <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />

        {/* Lightbox */}
        {selectedPhoto && (
          <Lightbox
            photo={selectedPhoto}
            onClose={closeLightbox}
            onNext={() => navigateLightbox('next')}
            onPrev={() => navigateLightbox('prev')}
          />
        )}

        {/* Conditional Content Rendering */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorDisplay />
        ) : (
          <main className="relative z-10">
            <div className="max-w-screen-xl mx-auto p-6" ref={scrollRef}>
              <Section id="gallery-intro">
                <motion.h1
                  className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent tracking-tight pb-2"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  Gallery
                </motion.h1>
              </Section>

              <Section id="photo-grid">
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                  {photos.length > 0 ? (
                    photos.map((photo) => (
                      <motion.div
                        key={photo.id}
                        className="break-inside-avoid mb-4 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openLightbox(photo)}
                      >
                        <div className="relative">
                          <img
                            src={photo.urls.regular}
                            alt={photo.alt_description || 'Photo'}
                            loading="lazy"
                            className="object-cover w-full transition-all duration-300"
                          />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <span className="text-white text-sm font-light">Click to preview & download</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center">No images found.</p>
                  )}
                </div>
              </Section>

              {/* Pagination - Original Design */}
              <Section id="pagination">
                <div className="mt-8 flex flex-col justify-center gap-4 items-center">
                  {/* Display the current set of page numbers */}
                  <div className="flex gap-2 justify-center">
                    {/* Always show the first page */}
                    <motion.button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      className="px-4 py-1 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-30 transition-all duration-300"
                      style={{
                        background: currentPage === 1
                          ? 'rgba(128, 0, 128, 0.3)'
                          : 'rgba(173, 216, 230, 0.2)',
                        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        color: currentPage === 1
                          ? 'rgba(255, 255, 255, 1)'
                          : 'rgba(255, 255, 255, 0.8)',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      1
                    </motion.button>

                    {/* Ellipses if there are more pages between */}
                    {currentPage > 4 && <span className="text-white">...</span>}

                    {/* Pages around the current page */}
                    {Array.from({ length: 5 }, (_, index) => {
                      const actualPage = currentPage - 2 + index;
                      if (actualPage > 1 && actualPage < totalPages) {
                        return (
                          <motion.button
                            key={actualPage}
                            onClick={() => handlePageChange(actualPage)}
                            className="px-4 py-1 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-30 transition-all duration-300"
                            style={{
                              background: currentPage === actualPage
                                ? 'rgba(128, 0, 128, 0.3)'
                                : 'rgba(173, 216, 230, 0.2)',
                              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                              border: '1px solid rgba(255, 255, 255, 0.25)',
                              color: currentPage === actualPage
                                ? 'rgba(255, 255, 255, 1)'
                                : 'rgba(255, 255, 255, 0.8)',
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {actualPage}
                          </motion.button>
                        );
                      }
                      return null;
                    })}

                    {/* Ellipses if there are more pages towards the end */}
                    {currentPage < totalPages - 3 && <span className="text-white">...</span>}

                    {/* Always show the last page */}
                    {totalPages > 1 && (
                      <motion.button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className="px-4 py-1 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-30 transition-all duration-300"
                        style={{
                          background: currentPage === totalPages
                            ? 'rgba(128, 0, 128, 0.3)'
                            : 'rgba(173, 216, 230, 0.2)',
                          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                          border: '1px solid rgba(255, 255, 255, 0.25)',
                          color: currentPage === totalPages
                            ? 'rgba(255, 255, 255, 1)'
                            : 'rgba(255, 255, 255, 0.8)',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {totalPages}
                      </motion.button>
                    )}
                  </div>

                  {/* "Previous" and "Next" buttons below */}
                  <div className="flex justify-between gap-2 w-full max-w-xs">
                    {currentPage > 1 && (
                      <motion.button
                        onClick={handlePrevPage}
                        className="w-full px-6 py-2 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-20 transition-all duration-300"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                          border: '1px solid rgba(255, 255, 255, 0.18)',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Previous
                      </motion.button>
                    )}

                    {currentPage < totalPages && (
                      <motion.button
                        onClick={handleNextPage}
                        className="w-full px-6 py-2 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-20 transition-all duration-300"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                          border: '1px solid rgba(255, 255, 255, 0.18)',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Next
                      </motion.button>
                    )}
                  </div>
                </div>
              </Section>

              <style jsx>{`
              @media (max-width: 640px) {
                button {
                  font-size: 14px;
                  padding: 10px 16px;
                }
              }
            `}</style>
            </div>
          </main>
        )}
      </div>
    </>
  );
};

export default Gallery;