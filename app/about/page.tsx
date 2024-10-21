"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as THREE from 'three';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faInstagram, faUnsplash } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faDollarSign } from '@fortawesome/free-solid-svg-icons';

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

interface SocialButtonProps {
  href: string;
  icon: FontAwesomeIconProps['icon'];
  label: string;
  platform: keyof typeof gradientStyles;
}

const gradientStyles = {
  linkedin: 'linear-gradient(135deg, rgba(10, 102, 194, 0.1), rgba(10, 102, 194, 0.2))',
  github: 'linear-gradient(135deg, rgba(36, 41, 46, 0.1), rgba(36, 41, 46, 0.2))',
  instagram: 'linear-gradient(135deg, rgba(193, 53, 132, 0.1), rgba(193, 53, 132, 0.2))',
  email: 'linear-gradient(135deg, rgba(255, 196, 0, 0.1), rgba(255, 196, 0, 0.2))',
  fiverr: 'linear-gradient(135deg, rgba(0, 171, 85, 0.1), rgba(0, 171, 85, 0.2))',
  unsplash: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(169, 169, 169, 0.2))',
};

const SocialButton: React.FC<SocialButtonProps> = ({ href, icon, label, platform }) => (
  <motion.a
    href={href}
    className="flex items-center space-x-2 p-4 rounded-lg transition-all duration-300 backdrop-blur-md hover:bg-opacity-30"
    style={{
      background: gradientStyles[platform],
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      color: 'white',
    }}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-opacity-20 backdrop-blur-md" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
      <FontAwesomeIcon icon={icon} />
    </div>
    <span className="font-medium">{label}</span>
  </motion.a>
);

const About: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current!, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positionArray = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);

    scene.add(stars);
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.0002;
      stars.rotation.x += 0.0001;
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
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />
      <main className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          <Section id="about-intro">
            <motion.h1
              className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              About Me
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300 mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Hello! I&apos;m Mithil Girish, a versatile full-stack web and mobile app developer, graphic designer, photographer, 
              and technology enthusiast. My passion lies in combining creativity with technical expertise to build user-centric 
              digital experiences.
            </motion.p>
          </Section>

          <Section id="skills">
            <h2 className="text-4xl font-semibold mb-4">My Skills</h2>
            <ul className="text-lg text-gray-300 mb-8 list-disc list-inside">
              <li>Full Stack Web Development (React, Node.js, Django, Next.js)</li>
              <li>Mobile App Development (React Native, Expo)</li>
              <li>Backend Development (Express.js, Django Rest Framework)</li>
              <li>UI/UX Design and Responsive Web Design</li>
              <li>Graphic Design (Adobe Photoshop, UI Design)</li>
              <li>Photography</li>
              <li>Game Development (Unity, C#)</li>
              <li>IoT & Hardware Integration (ESP32, Arduino)</li>
            </ul>
          </Section>

          <Section id="contact">
            <h2 className="text-4xl font-semibold mb-6">Connect with Me</h2>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              <SocialButton
                href="https://www.linkedin.com/in/mithilgirish/"
                icon={faLinkedin}
                label="LinkedIn"
                platform="linkedin"
              />
              <SocialButton
                href="https://github.com/mithilgirish"
                icon={faGithub}
                label="GitHub"
                platform="github"
              />
              <SocialButton
                href="https://www.instagram.com/mithilgirish/"
                icon={faInstagram}
                label="Instagram"
                platform="instagram"
              />
              <SocialButton
                href="mailto:t.r.mithil@gmail.com"
                icon={faEnvelope}
                label="Email"
                platform="email"
              />
              <SocialButton
                href="https://www.fiverr.com/mithilgirish"
                icon={faDollarSign}
                label="Fiverr"
                platform="fiverr"
              />
              <SocialButton
                href="https://unsplash.com/@mithilgirish"
                icon={faUnsplash}
                label="Unsplash"
                platform="unsplash"
              />
            </motion.div>
          </Section>
        </div>
      </main>
    </div>
  );
};

export default About;
