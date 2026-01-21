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
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
              <motion.div
                className="ml-6 w-fit mt-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative group w-fit">
                  {/* Glow effect */}
                  <div className="absolute inset-0 -m-2 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-300 animate-tilt z-0"></div>

                  {/* Profile image */}
                  <img
                    src="/images/DP-mithil.png"
                    alt="Mithil Girish"
                    width={215}
                    height={215}
                    className="relative z-10 rounded-full object-cover border-4 border-white/20 backdrop-blur-3xl p-1 shadow-xl shadow-black/20 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </motion.div>


              <div className="lg:w-2/3">
                <motion.h1
                  className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent tracking-tight pb-2"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  About Me
                </motion.h1>
                <motion.div
                  className="text-xl text-gray-400 mb-12 font-light leading-relaxed"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <p className="mb-6">
                    Hello! I&apos;m <span className="text-white font-medium">Mithil Girish</span>, a versatile technology professional based in Chennai, India. I&apos;m a passionate <span className="text-blue-400">full-stack developer</span>, <span className="text-violet-400">graphic designer</span>, <span className="text-rose-400">photographer</span>, and technology enthusiast who bridges the gap between innovative design and cutting-edge development.
                  </p>
                  <p className="mb-6">
                    With expertise spanning <span className="text-white">web development, mobile applications, IoT systems, and digital design</span>, I craft experiences that are not only functional but truly engaging. My journey combines technical precision with creative vision to deliver solutions that make a difference—from AI-powered farm management apps to innovative web solutions using modern tech stacks.
                  </p>
                  <p>
                    Currently pursuing <span className="text-gray-200">Bachelor of Technology in Data Science</span> at VIT Chennai (2023-2027) while actively contributing to tech communities and building impactful projects that solve real-world problems.
                  </p>
                </motion.div>
              </div>
            </div>
          </Section>

          <Section id="skills">
            <h2 className="text-4xl font-semibold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent pb-2">Technical Arsenal</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-lg text-gray-300">
              <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                <h3 className="text-2xl font-medium text-blue-400 mb-4">Web Development</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>React.js, Next.js</li>
                  <li>TypeScript, JavaScript</li>
                  <li>Tailwind CSS, ShadCN/UI</li>
                  <li>FastAPI, Django, Node.js</li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                <h3 className="text-2xl font-medium text-blue-400 mb-4">Mobile Development</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>React Native, Expo</li>
                  <li>Progressive Web Apps (PWA)</li>
                  <li>Clerk Auth, Supabase</li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                <h3 className="text-2xl font-medium text-blue-400 mb-4">Data & AI</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Python (Data Science)</li>
                  <li>Machine Learning, GenAI</li>
                  <li>PostgreSQL, MongoDB, MySQL</li>
                  <li>Supabase, Firebase</li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                <h3 className="text-2xl font-medium text-blue-400 mb-4">Blockchain & Web3</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Solidity, Smart Contracts</li>
                  <li>Ethereum, DeFi Protocols</li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                <h3 className="text-2xl font-medium text-blue-400 mb-4">Hardware & IoT</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>ESP32, Arduino</li>
                  <li>Sensor Integration</li>
                  <li>Embedded Systems</li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                <h3 className="text-2xl font-medium text-blue-400 mb-4">Creative</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Adobe Photoshop, Figma</li>
                  <li>UI/UX Design</li>
                  <li>Professional Photography</li>
                  <li>Unsplash Contributor</li>
                </ul>
              </div>
            </div>
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
