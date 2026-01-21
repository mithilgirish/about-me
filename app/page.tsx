"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import * as THREE from 'three';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

// --- Custom Three.js Hook ---
// This moves Three.js effect logic out for tidy composition.
const useStarfield = (canvasRef: React.RefObject<HTMLCanvasElement>, scrollY: MotionValue<number>) => {
  useEffect(() => {
    if (!canvasRef.current) return;
    // Everything below is your original logic...

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const starLayers: THREE.Points[] = [];
    const layerData = [
      { count: 1500, size: 0.5, z: -1000, color: 0xaaaaaa },
      { count: 1000, size: 0.8, z: -500, color: 0xbbbbbb },
      { count: 500, size: 1.2, z: -200, color: 0xffffff },
    ];
    layerData.forEach(layer => {
      const starsGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(layer.count * 3);
      for (let i = 0; i < layer.count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 1000;
        positions[i3 + 1] = (Math.random() - 0.5) * 1000;
        positions[i3 + 2] = (Math.random() - 0.5) * 1000 + layer.z;
      }
      starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const starsMaterial = new THREE.PointsMaterial({
        size: layer.size,
        color: layer.color,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
      });
      const starField = new THREE.Points(starsGeometry, starsMaterial);
      starLayers.push(starField);
      scene.add(starField);
    });

    const mouse = new THREE.Vector2();
    let isTouch = false;
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (event: TouchEvent) => {
      isTouch = true;
      const touch = event.touches[0];
      mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      camera.position.y = -scrollY.get() * 0.1;
      // Parallax disables on mobile
      if (!isTouch) {
        camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.02;
        camera.position.z += (-mouse.y * 0.5 - camera.position.z + 1) * 0.02;
      }
      starLayers[0].rotation.y = elapsedTime * 0.01;
      starLayers[1].rotation.y = elapsedTime * 0.02;
      starLayers[2].rotation.y = elapsedTime * 0.03;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
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
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      // More disposal: renderer.dispose(), dispose geometries/materials, etc.
    };
  }, [canvasRef, scrollY]);
};

interface SectionProps {
  children: React.ReactNode;
  id: string;
}

const Section: React.FC<SectionProps> = ({ children, id }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
      className="mb-20 text-center"
    >
      {children}
    </motion.section>
  );
};

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scrollY } = useScroll();
  useStarfield(canvasRef, scrollY); // integrates improved hook

  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [showScrollUpArrow, setShowScrollUpArrow] = useState(false);

  // useCallback for better arrow scroll performance
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollUpArrow(window.scrollY > window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />

      {/* Foreground background layer */}
      <motion.img
        src="/images/background.png"
        alt="decorative background"
        className="fixed bottom-0 left-0 w-full h-auto opacity-35 object-cover z-20 pointer-events-none"
        style={{
          y: useTransform(scrollY, [0, 800], [0, 250]),
          scale: useTransform(scrollY, [0, 800], [1, 1.2])
        }}
      />

      <main className="relative">
        <div className="h-screen flex flex-col justify-center items-center">
          <motion.div
            className="text-center px-4 max-w-4xl w-full mt-[-190px]"
            style={{ opacity: heroOpacity }}
          >
            <motion.h1
              className="text-6xl sm:text-7xl md:text-9xl font-bold mb-6 relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, delay: 0.5 }}
            >
              <span className="relative inline-block">
                <span
                  className="relative text-white"
                  style={{ textShadow: `0 0 30px rgba(255, 255, 255, 0.4), 0 0 60px rgba(255, 255, 255, 0.1)` }}
                >
                  Mithil Girish
                </span>
              </span>
            </motion.h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-center relative z-30 mb-8">
              <motion.span
                className="block text-gray-200 font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, delay: 1.5 }}
              >
                Full Stack Developer & Data Scientist
              </motion.span>
              <motion.span
                className="block text-lg md:text-xl text-gray-400 mt-2 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 2.5 }}
              >
                Pre-Final year at VIT Chennai
              </motion.span>
            </p>

            <motion.a
              href="https://freelance.mithilgirish.dev/query"
              target="_blank"
              rel="noopener noreferrer"
              className="
        mt-8 inline-block px-6 py-2 rounded-lg
        bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.18)]
        shadow-[0_8px_32px_rgba(31,38,135,0.37)] backdrop-blur-sm
        transition-all duration-300
      "
              whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
            >
              Let&apos;s Build Together
            </motion.a>


          </motion.div>


          <motion.div
            className="absolute  flex justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <motion.button
              aria-label="Scroll down to content "
              className="focus:outline-none p-2 touch-manipulation hover:text-blue-400 transition-colors mt-52 z-30"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronDown size={32} strokeWidth={2} />
            </motion.button>
          </motion.div>



        </div>

        <div className="container mx-auto px-4 py-20">
          <Section id="GAP">
            <h2 className="text-4xl font-bold mb-4"></h2>
          </Section>
          <Section id="about">
            <h2 className="text-4xl font-bold mb-4">About Me</h2>
            <p className="text-lg text-gray-300 mb-6">
              A Full Stack Developer with expertise in web development, graphic design, UI/UX, and game development.
              <br />
              I&apos;m passionate about blending creativity with technology to build user-centric digital experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/about">
                <motion.button
                  aria-label="Learn more about me"
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
              <Link href="/experience">
                <motion.button
                  aria-label="View my experience"
                  className="px-6 py-2 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-20 transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Experience
                </motion.button>
              </Link>
            </div>
          </Section>
          <Section id="projects">
            <h2 className="text-4xl font-bold mb-4">Projects</h2>
            <p className="text-lg text-gray-300 mb-6">
              From AI-powered farm management apps to dynamic web solutions, explore my diverse projects
              <br />
              that showcase my skills in the PERN stack, React Native, and more.
            </p>
            <Link href="/projects">
              <motion.button
                aria-label="View my projects"
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
              Explore my curated gallery featuring a selection of top photographs I&apos;ve captured and shared on Unsplash,
              <br />
              where creativity and visual storytelling come together.
            </p>
            <Link href="/gallery">
              <motion.button
                aria-label="View my gallery"
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
        </div>
      </main>
      {showScrollUpArrow && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 cursor-pointer transition-all duration-300"
          onClick={scrollToTop}
        >
          <ChevronUp size={32} className="text-white hover:text-gray-400 transition" />
        </motion.div>
      )}
    </div>
  );
};

export default Home;
