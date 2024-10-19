"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as THREE from 'three';
import { Linkedin, Github, Mail, DollarSign, LucideIcon } from 'lucide-react';

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
  icon: React.ReactElement<LucideIcon>;
  label: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ href, icon, label }) => (
  <motion.a
    href={href}
    className="group flex items-center space-x-2 p-4 rounded-lg transition duration-300 bg-gray-800 hover:bg-gray-700 shadow-md hover:shadow-lg"
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 group-hover:bg-gray-600 transition duration-300">
      {React.cloneElement(icon)}
    </div>
    <span className="text-white font-medium group-hover:text-gray-300 transition duration-300">{label}</span>
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
              digital experiences. My journey has taken me across domains, including AI-powered apps, game development, IoT (Internet of Things) solutions, 
              and responsive web and mobile applications. I thrive on challenges that integrate hardware and software to solve real-world problems.
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
              <li>Photography </li>
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
                icon={<Linkedin />}
                label="LinkedIn"
              />
              <SocialButton
                href="https://github.com/mithilgirish"
                icon={<Github />}
                label="GitHub"
              />
              <SocialButton
                href="mailto:t.r.mithil@gmail.com"
                icon={<Mail />}
                label="Email"
              />
              <SocialButton
                href="https://www.fiverr.com/mithilgirish"
                icon={<DollarSign />}
                label="Fiverr"
              />
              <SocialButton
                href="https://www.upwork.com/freelancers/~mithilgirish"
                icon={<DollarSign />}
                label="Upwork"
              />
            </motion.div>
          </Section>
        </div>
      </main>
    </div>
  );
};

export default About;