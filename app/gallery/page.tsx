"use client";

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 10;

interface Photo {
  id: string;
  alt_description: string | null;
  urls: {
    small: string;
    thumb: string;
  };
  links: {
    html: string;
  };
}

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchPhotos = async (page: number) => {
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
      setTotalPages(parseInt(res.headers['x-total-pages'] || '7'));
    } catch (error) {
      console.error("Error fetching photos:", error);
      setError("Failed to fetch photos. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(currentPage);
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);

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

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="spinner"></div></div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6" ref={scrollRef}>
      <motion.div
        className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0 }}
        style={{ lineHeight: '1.2', marginBottom: '16px' }}
      >
        Gallery
      </motion.div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {photos.length > 0 ? (
          photos.map((photo) => (
            <motion.div 
              key={photo.id} 
              className="break-inside-avoid mb-4 rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <a href={photo.links.html} target="_blank" rel="noopener noreferrer">
                <Image
                  src={photo.urls.small}
                  alt={photo.alt_description || 'Photo'}
                  width={300}
                  height={200}
                  className="object-cover w-full"
                  placeholder="blur"
                  blurDataURL={photo.urls.thumb}
                />
              </a>
            </motion.div>
          ))
        ) : (
          <p className="text-center">No images found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        {currentPage > 1 && (
          <motion.button
            onClick={handlePrevPage}
            className="px-6 py-2 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-20 transition-all duration-300"
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

        {Array.from({ length: totalPages }, (_, index) => (
          <motion.button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className="px-4 py-1 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-30 transition-all duration-300"
            style={{
              background: currentPage === index + 1 
                ? 'rgba(128, 0, 128, 0.3)' 
                : 'rgba(173, 216, 230, 0.2)',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
              border: '1px solid rgba(255, 255, 255, 0.25)', 
              color: currentPage === index + 1 
                ? 'rgba(255, 255, 255, 1)' 
                : 'rgba(255, 255, 255, 0.8)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {index + 1}
          </motion.button>
        ))}

        {currentPage < totalPages && (
          <motion.button
            onClick={handleNextPage}
            className="px-6 py-2 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-20 transition-all duration-300"
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
  );
};

export default Gallery;