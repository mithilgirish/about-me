"use client";
import './globals.css';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

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
      className="mb-20 text-center"
    >
      {children}
    </motion.section>
  );
};

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);
  const [showScrollUpArrow, setShowScrollUpArrow] = useState(false);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positionArray = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const stars = new THREE.Points(starsGeometry, starsMaterial);

    scene.add(stars);
    camera.position.z = 5;

    const shootingStars: THREE.Mesh[] = [];

    const createShootingStar = () => {
      const shootingStarGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const shootingStarMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const shootingStar = new THREE.Mesh(shootingStarGeometry, shootingStarMaterial);

      shootingStar.position.x = (Math.random() - 0.5) * 2000;
      shootingStar.position.y = (Math.random() - 0.5) * 2000;
      shootingStar.position.z = 5;

      shootingStars.push(shootingStar);
      scene.add(shootingStar);

      const duration = Math.random() * 2 + 1;
      const startTime = performance.now();

      const animateShootingStar = () => {
        const elapsedTime = (performance.now() - startTime) / 1000;
        if (elapsedTime < duration) {
          shootingStar.position.y -= 5 * (elapsedTime / duration);
          requestAnimationFrame(animateShootingStar);
        } else {
          scene.remove(shootingStar);
        }
      };

      requestAnimationFrame(animateShootingStar);
    };

    const shootingStarInterval = setInterval(createShootingStar, 500);

    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    const handleScroll = () => {
      setShowScrollUpArrow(window.scrollY > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);

    animate();

    return () => {
      clearInterval(shootingStarInterval);
      document.body.removeChild(renderer.domElement);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black text-white font-sans overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />
      <main className="relative z-10">
        <div className="h-screen flex flex-col justify-center items-center">
          <motion.div className="text-center px-4 max-w-4xl w-full" style={{ opacity }}>
            <p className="text-xl text-gray-400 mb-4">Hi there 👋 I&apos;m</p>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
              Mithil Girish
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 mx-auto">
              2nd Year CSE student at VIT Chennai
            </p>
            <div className="absolute inset-x-0 flex justify-center animate-bounce">
              <ChevronDown size={32} />
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-20">
          <Section id="about">
            <h2 className="text-4xl font-bold mb-4">About Me</h2>
            <p className="text-lg text-gray-300 mb-6">
              A Full Stack Developer with expertise in web development, graphic design, UI/UX, and game development. <br />
              I&apos;m passionate about blending creativity with technology to build user-centric digital experiences.
            </p>
            <Link href="/about">
              <motion.button
                className="px-6 py-2 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-20 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </Link>
          </Section>

          <Section id="projects">
            <h2 className="text-4xl font-bold mb-4">Projects</h2>
            <p className="text-lg text-gray-300 mb-6">
              From AI-powered farm management apps to dynamic web solutions, explore my diverse projects <br />
              that showcase my skills in the PERN stack, React Native, and more.
            </p>
            <Link href="/projects">
              <motion.button
                className="px-6 py-2 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-20 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Projects
              </motion.button>
            </Link>
          </Section>

          <Section id="gallery">
            <h2 className="text-4xl font-bold mb-4">Gallery</h2>
            <p className="text-lg text-gray-300 mb-6">
              Explore my curated gallery featuring a selection of top photographs I&apos;ve captured and shared on Unsplash, <br />
              where creativity and visual storytelling come together.
            </p>
            <Link href="/gallery">
              <motion.button
                className="px-6 py-2 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-20 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Gallery
              </motion.button>
            </Link>
          </Section>

          <Section id="contact">
            <h2 className="text-4xl font-bold mb-4">Contact</h2>
            <p className="text-lg text-gray-300 mb-6">
              Let&apos;s connect! Whether you have a project in mind or just want to say hi, I&apos;d love to hear from you.
            </p>
            <Link href="/contact">
              <motion.button
                className="px-6 py-2 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-20 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get in Touch
              </motion.button>
            </Link>
          </Section>
        </div>
      </main>

      {showScrollUpArrow && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
          onClick={scrollToTop}
        >
          <ChevronUp size={32} className="text-white cursor-pointer hover:text-gray-400 transition" />
        </motion.div>
      )}
    </div>
  );
};

export default Home;
