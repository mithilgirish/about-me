"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
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
    triggerOnce: true,
  });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-16"
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
  linkedin: 'linear-gradient(135deg, rgba(10, 102, 194, 0.12), rgba(10, 102, 194, 0.22))',
  github: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.14))',
  instagram: 'linear-gradient(135deg, rgba(193, 53, 132, 0.12), rgba(193, 53, 132, 0.22))',
  email: 'linear-gradient(135deg, rgba(255, 196, 0, 0.12), rgba(255, 196, 0, 0.22))',
  fiverr: 'linear-gradient(135deg, rgba(0, 171, 85, 0.12), rgba(0, 171, 85, 0.22))',
  unsplash: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(169, 169, 169, 0.14))',
};

const SocialButton: React.FC<SocialButtonProps> = ({ href, icon, label, platform }) => (
  <motion.a
    href={href}
    className="flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 backdrop-blur-md border border-white/12 hover:border-white/30"
    style={{
      background: gradientStyles[platform],
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
      color: 'white',
    }}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.04, y: -2 }}
    whileTap={{ scale: 0.96 }}
  >
    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/15">
      <FontAwesomeIcon icon={icon} className="text-lg" />
    </div>
    <span className="font-medium text-sm tracking-wide">{label}</span>
  </motion.a>
);

const About: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current!, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positionArray = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1.5, transparent: true, opacity: 0.75 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);

    scene.add(stars);
    camera.position.z = 5;

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      stars.rotation.y = scrollY.get() * 0.0005 + 0.0002;
      stars.rotation.x += 0.0001;
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
    };
  }, [scrollY]);

  const skillCategories = [
    {
      code: '01',
      tag: 'WEB',
      title: 'Web Development',
      skills: ['React.js, Next.js', 'TypeScript, JavaScript', 'Tailwind CSS, ShadCN/UI', 'FastAPI, Django, Node.js'],
    },
    {
      code: '02',
      tag: 'MOBILE',
      title: 'Mobile Development',
      skills: ['React Native, Expo', 'Progressive Web Apps (PWA)', 'Clerk Auth, Supabase'],
    },
    {
      code: '03',
      tag: 'DATA & AI',
      title: 'Data & AI',
      skills: ['Python (Data Science)', 'Machine Learning, GenAI', 'PostgreSQL, MongoDB, MySQL', 'Supabase, Firebase'],
    },
    {
      code: '04',
      tag: 'WEB3',
      title: 'Blockchain & Web3',
      skills: ['Solidity, Smart Contracts', 'Ethereum, DeFi Protocols'],
    },
    {
      code: '05',
      tag: 'HARDWARE',
      title: 'Hardware & IoT',
      skills: ['ESP32, Arduino', 'Sensor Integration', 'Embedded Systems'],
    },
    {
      code: '06',
      tag: 'CREATIVE',
      title: 'Creative & Optics',
      skills: ['Adobe Photoshop, Figma', 'UI/UX Design', 'Professional Photography', 'Unsplash Contributor (700k+ Views)'],
    },
  ];

  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden selection:bg-white selection:text-black">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />

      <main className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 max-w-7xl">
          
          {/* INTRO BIOGRAPHY */}
          <Section id="about-intro">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
              
              {/* Profile Avatar with Micro-Glow & Hover Tilt */}
              <motion.div
                className="w-fit flex-shrink-0 mt-4 lg:mt-12"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                whileHover={{ y: -4 }}
              >
                <div className="relative group w-fit">
                  <div className="absolute inset-0 -m-2 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-700"></div>

                  <img
                    src="/images/DP-mithil.png"
                    alt="Mithil Girish"
                    width={215}
                    height={215}
                    className="relative z-10 rounded-full object-cover border-4 border-white/20 backdrop-blur-3xl p-1 shadow-xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </motion.div>

              {/* Bio Copy */}
              <div className="lg:w-2/3">
                <div className="flex items-center space-x-2 font-mono text-xs text-white/50 mb-2">
                  <span>01</span>
                  <span>//</span>
                  <span>BIOGRAPHY</span>
                </div>

                <motion.h1
                  className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent tracking-tight pb-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  About Me
                </motion.h1>

                <motion.div
                  className="text-lg text-gray-300 mb-6 font-light leading-relaxed space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <p>
                    Hello! I&apos;m <span className="text-white font-medium">Mithil Girish</span>, a versatile technology professional based in Chennai, India. I&apos;m a passionate <span className="text-blue-400">full-stack developer</span>, <span className="text-violet-400">graphic designer</span>, <span className="text-rose-400">photographer</span>, and technology enthusiast who bridges the gap between innovative design and cutting-edge development.
                  </p>
                  <p className="leading-relaxed">
                    With expertise spanning <span className="text-white font-medium">Edge AI, decentralized systems, AI context architectures, and full-stack development</span>, I craft experiences that are not only functional but highly scalable. My journey combines technical precision with deep architectural vision to deliver solutions that push the boundaries of modern engineering.
                  </p>
                  <p>
                    Currently pursuing <span className="text-gray-200">B.Tech in Computer Science and Engineering (Data Science)</span> at VIT Chennai (2023-2027).
                  </p>
                </motion.div>
              </div>
            </div>
          </Section>

          {/* STACK & ARCHITECTURE */}
          <Section id="skills">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
              <div className="flex items-center space-x-2 font-mono text-xs text-white/50">
                <span>02</span>
                <span>//</span>
                <span>STACK & ARCHITECTURE</span>
              </div>
              <span className="font-mono text-[10px] text-white/30">[ 06 CATEGORIES ]</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-semibold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent pb-1">
              Stack & Architecture
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-lg text-gray-300">
              {skillCategories.map((cat, idx) => (
                <motion.div
                  key={cat.code}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.07 }}
                  whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.25)' }}
                  className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800 backdrop-blur-md transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-center text-[10px] font-mono text-white/40 mb-3 pb-2 border-b border-zinc-800">
                    <span>SPEC // {cat.code}</span>
                    <span className="micro-tag text-[9px]">{cat.tag}</span>
                  </div>

                  <h3 className="text-xl font-medium text-blue-400 mb-3 font-sans">
                    {cat.title}
                  </h3>

                  <ul className="space-y-2 text-sm font-sans text-gray-300">
                    {cat.skills.map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60"></span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* CONNECT WITH ME */}
          <Section id="contact">
            <div className="flex items-center space-x-2 font-mono text-xs text-white/50 mb-2 border-b border-white/10 pb-3">
              <span>03</span>
              <span>//</span>
              <span>CONNECT & LINKS</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-semibold mb-6">Connect with Me</h2>

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
