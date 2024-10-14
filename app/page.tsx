"use client"; // This line tells Next.js that this component should be rendered on the client side.
import './globals.css'; // Import the global styles

import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import * as THREE from 'three';

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shootingStars: THREE.Mesh[] = []; // Array to hold shooting star meshes

  useEffect(() => {
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positionArray = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 2000; // Random position for each star
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const stars = new THREE.Points(starsGeometry, starsMaterial);

    scene.add(stars);
    camera.position.z = 5;

    // Function to create shooting stars
    const createShootingStar = () => {
      const shootingStarGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const shootingStarMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const shootingStar = new THREE.Mesh(shootingStarGeometry, shootingStarMaterial);

      // Randomly position the shooting star
      shootingStar.position.x = (Math.random() - 0.5) * 2000;
      shootingStar.position.y = (Math.random() - 0.5) * 2000;
      shootingStar.position.z = 5;

      shootingStars.push(shootingStar);
      scene.add(shootingStar);

      // Animate shooting star
      const duration = Math.random() * 2 + 1; // Random duration between 1s to 3s
      const startTime = performance.now();

      const animateShootingStar = () => {
        const elapsedTime = (performance.now() - startTime) / 1000; // Convert to seconds
        if (elapsedTime < duration) {
          shootingStar.position.y -= 5 * (elapsedTime / duration); // Move downward
          requestAnimationFrame(animateShootingStar);
        } else {
          scene.remove(shootingStar); // Remove after it leaves the view
        }
      };

      requestAnimationFrame(animateShootingStar);
    };

    // Create shooting stars at intervals
    const shootingStarInterval = setInterval(createShootingStar, 500); // Create a shooting star every 500ms

    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.001; // Rotate the stars for a twinkling effect
      renderer.render(scene, camera);
    };

    animate();

    // Clean up on unmount
    return () => {
      clearInterval(shootingStarInterval); // Clear interval when component unmounts
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black text-white font-sans">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-[100vw] h-[100vh] z-0" />
      <main className="container mx-auto px-4 py-20 text-center relative z-10">
        <p className="text-xl text-gray-400 mb-4 animate-fadeIn">
          Hi there 👋 I&apos;m
        </p>
        <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fadeInUp bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Mithil Girish
        </h1>
        {/* Ensure the text is centered */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto animate-fadeIn">
          Crafting digital experiences that inspire
        </p>
        {/* Align button in a flex container */}
        <div className="flex justify-center mb-10"> {/* Add margin to separate from Chevron */}
          <button className="px-8 py-3 bg-white text-black rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Explore My Work
          </button>
        </div>
      </main>
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <ChevronDown size={32} />
      </div>
    </div>
  );
};

export default Home;
