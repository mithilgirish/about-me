"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from './gallery.module.css';

const ITEMS_PER_PAGE = 10;

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`https://api.unsplash.com/users/mithilgirish/photos`, {
        params: {
          page: page,
          per_page: ITEMS_PER_PAGE,
          order_by: 'views' // Change this to 'latest' or any other option as needed
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
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.galleryContainer}>
      <h1>Gallery</h1>
      <div className={styles.photoList}>
        {photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo.id} className={styles.photoItem}>
              <a href={photo.links.html} target="_blank" rel="noopener noreferrer">
                <Image
                  src={photo.urls.small}
                  alt={photo.alt_description || 'Photo'}
                  width={300}
                  height={200}
                  className={styles.image}
                  placeholder="blur"
                  blurDataURL={photo.urls.thumb}
                  style={{ objectFit: 'cover' }} // Adjusts image to fit container
                />
              </a>
            </div>
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>

      <div className={styles.pagination}>
        {/* Show Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? styles.active : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className={styles.prevNext}>
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </button>
        )}
        {currentPage < totalPages && (
          <button onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </button>
        )}
      </div>
    </div>

  );
};

export default Gallery;
