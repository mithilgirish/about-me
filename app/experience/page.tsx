"use client";
import React, { useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import * as THREE from "three";
import { Calendar } from "lucide-react";

interface SectionProps {
  children: React.ReactNode;
  id: string;
}

interface Experience {
  organization: string;
  positions: {
    title: string;
    duration: string;
    description?: string;
  }[];
  logo: string;
  type: "clubs" | "experience";
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

export default function ExperiencePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 70, damping: 22 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1200;
    const positionArray = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    const starsMaterial = new THREE.PointsMaterial({
      size: 1.5,
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    camera.position.z = 10;

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      stars.rotation.y = smoothScrollY.get() * 0.0004 + 0.0002;
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
      starsGeometry.dispose();
      starsMaterial.dispose();
    };
  }, [smoothScrollY]);

  const experiences: Experience[] = [
    {
      organization: "FinkAI",
      logo: "finkai.jpg",
      type: "experience",
      positions: [
        {
          title: "Software Development Engineer (SDE) Intern",
          duration: "May 2026 - Jul 2026",
          description: "Contributed to an Elixir/Phoenix LiveView financial reporting platform powered by Apache Iceberg, DuckDB, and a custom multi-tenant SQLite PITR tool."
        }
      ]
    },
    {
      organization: "ANNAM.AI",
      logo: "annamai.png",
      type: "experience",
      positions: [
        {
          title: "Project Intern",
          duration: "May 2025 - Jul 2025",
          description: "Built a React Native and FastAPI platform with ESP32 integration for real-time agri-sensor data and fault-tolerant ingestion pipelines."
        }
      ]
    },
    {
      organization: "IGCAR (Indira Gandhi Centre for Atomic Research)",
      logo: "igcar.png",
      type: "experience",
      positions: [
        {
          title: "Summer Research Intern",
          duration: "Jun 2025 - Jul 2025",
          description: "Implemented KNN classification for radiological safety zones and built a Next.js dashboard for real-time sensor monitoring."
        }
      ]
    },
    {
      organization: "FinaHQ",
      logo: "finahq.jpeg",
      type: "experience",
      positions: [
        {
          title: "Software Development Engineer (SDE) Intern",
          duration: "May 2024 - Jul 2024",
          description: "Engineered full-stack FinTech modules using React, Node.js, Express, and PostgreSQL, implementing OAuth 2.0 authentication."
        }
      ]
    },
    {
      organization: "Channelise",
      logo: "channelise.png",
      type: "experience",
      positions: [
        {
          title: "Co-Founder",
          duration: "Dec 2024 - Dec 2025",
          description: "Co-founded the creator platform and led product architecture, engineering, and full-stack development."
        }
      ]
    },
    {
      organization: "Microsoft Innovations Club (MIC) VITC",
      logo: "mic.png",
      type: "clubs",
      positions: [
        {
          title: "Development Lead",
          duration: "Apr 2025 - Apr 2026",
          description: "Promoted from Web Development member."
        },
        {
          title: "Web Dev member",
          duration: "Oct 2024 - Apr 2025"
        }
      ]
    },
    {
      organization: "Open Source Programming Club (OSPC) VITC",
      logo: "ospc.png",
      type: "clubs",
      positions: [
        {
          title: "Vice President",
          duration: "Apr 2025 - Nov 2025",
          description: "Led club operations and events."
        },
        {
          title: "Web Dev lead",
          duration: "Sep 2024 - Apr 2025"
        }
      ]
    },
    {
      organization: "MOVIS (Special Team)",
      logo: "movis.png",
      type: "clubs",
      positions: [
        {
          title: "Programming Lead",
          duration: "Aug 2025 - Oct 2025"
        },
        {
          title: "Programming and analysis member",
          duration: "Apr 2024 - Aug 2025"
        }
      ]
    },
    {
      organization: "E-Cell, VIT Chennai",
      logo: "ecell.png",
      type: "clubs",
      positions: [
        {
          title: "Web Developer",
          duration: "Sep 2024 - Sep 2025"
        }
      ]
    }
  ];

  const internshipExperiences = experiences.filter(e => e.type === "experience");
  const clubExperiences = experiences.filter(e => e.type === "clubs");

  const achievements = [
    {
      title: "1st Place - Annam.AI National Innovation Challenge",
      date: "Nov 2025",
      description: "Secured 1st place out of 500+ teams for architecting an integrated hardware-software ecosystem for multilingual farm diagnostics."
    },
    {
      title: "Finalist (Top 28 Teams) - ET AI Hackathon 2.0",
      date: "2026",
      description: "Finished among the top 28 finalist teams out of 60,000+ participants in the ET AI Hackathon 2.0."
    },
    {
      title: "Amazon ML Summer School 2026 Scholar",
      date: "2026",
      description: "Selected as an Amazon ML Summer School Scholar, ranking in the top 2% among 134,000+ applicants nationwide."
    },
    {
      title: "Top 2% Finalist - India AI Impact Buildathon",
      date: "2026",
      description: "Achieved a Top 2% finish among 40,000+ participants in a national-level AI impact challenge hosted by HCL GUVI."
    },
    {
      title: "Hackathon Winner - DeFy'26",
      date: "Jan 2026",
      description: "Awarded two bounties for designing smart contract flows for premium pooling and automated micro-insurance payouts."
    },
    {
      title: "National Pitch-a-thon Finalist",
      date: "2025",
      description: "Secured 5th place with a special mention for innovative pitch strategy and technical execution."
    }
  ];

  const ExperienceCard = ({ experience, index, theme = 'sky' }: { experience: Experience; index: number; theme?: 'sky' | 'violet' | 'green' | 'orange' }) => {
    const themeStyles = {
      sky: {
        wrapper: 'hover:border-sky-500/60 hover:bg-sky-500/5',
        text: 'text-sky-300',
        subText: 'text-sky-400',
        leftBorder: 'border-l-sky-400'
      },
      violet: {
        wrapper: 'hover:border-violet-500/60 hover:bg-violet-500/5',
        text: 'text-violet-300',
        subText: 'text-violet-400',
        leftBorder: 'border-l-violet-400'
      },
      green: {
        wrapper: 'hover:border-emerald-500/60 hover:bg-emerald-500/5',
        text: 'text-emerald-300',
        subText: 'text-emerald-400',
        leftBorder: 'border-l-emerald-400'
      },
      orange: {
        wrapper: 'hover:border-amber-500/60 hover:bg-amber-500/5',
        text: 'text-amber-300',
        subText: 'text-amber-400',
        leftBorder: 'border-l-amber-400'
      }
    };

    const currentTheme = themeStyles[theme];

    return (
      <motion.div
        className={`group bg-zinc-900/60 backdrop-blur-md p-6 rounded-xl border border-zinc-800 transition-all duration-300 ${currentTheme.wrapper} relative overflow-hidden`}
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        whileHover={{ y: -4, scale: 1.02 }}
      >
        

        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0">
              <img
                src={`/logos/${experience.logo}`}
                alt={`${experience.organization} logo`}
                width={80}
                height={80}
                className="rounded-sm transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/80?text=" + experience.organization.charAt(0);
                }}
              />
            </div>
            <h3 className={`text-lg font-semibold ${currentTheme.text} transition-colors font-sans`}>
              {experience.organization}
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {experience.positions.map((position, posIndex) => (
            <div key={posIndex} className={`border-l-2 pl-3.5 ${currentTheme.leftBorder} transition-colors duration-300`}>
              <h4 className="text-base font-semibold text-white mb-0.5">
                {position.title}
              </h4>
              <div className={`flex items-center gap-1.5 text-xs mb-1.5 font-mono ${currentTheme.subText}`}>
                <Calendar size={11} className={currentTheme.subText} />
                <span>{position.duration}</span>
              </div>
              {position.description && (
                <p className="text-gray-400 text-xs leading-relaxed font-light">{position.description}</p>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden selection:bg-white selection:text-black">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />

      <main className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-7xl">
          
          {/* INTRO HERO */}
          <Section id="experience-intro">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[#EBF4F5] to-[#B5C6E0] bg-clip-text text-transparent tracking-tight leading-[1.15] pb-4 pt-1 inline-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              My Experience
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Explore my journey through leadership roles, technical contributions,
              and professional growth across startups, research institutes, and engineering teams.
            </motion.p>
          </Section>

          {/* INTERNSHIPS & WORK EXPERIENCE */}
          <Section id="experience" >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {internshipExperiences.map((experience, index) => {
                let theme: 'sky' | 'violet' | 'green' | 'orange' = 'sky';
                if (experience.organization.includes("Channelise")) theme = 'violet';
                else if (experience.organization.includes("ANNAM")) theme = 'green';
                else if (experience.organization.includes("FinaHQ")) theme = 'orange';
                else if (experience.organization.includes("Fink")) theme = 'sky';

                return (
                  <ExperienceCard
                    key={`internship-${index}`}
                    experience={experience}
                    index={index}
                    theme={theme}
                  />
                );
              })}
            </div>
          </Section>

          {/* CLUB LEADERSHIP WORK */}
          <Section id="club-experiences" >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-3 text-white tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Club Work
            </motion.h2>

            <motion.p
              className="text-sm md:text-base text-gray-300 mb-8 max-w-2xl font-light"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Leadership roles and technical contributions across student organizations
              and programming clubs at VIT Chennai.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {clubExperiences.map((experience, index) => (
                <ExperienceCard
                  key={`club-${index}`}
                  experience={experience}
                  index={index}
                  theme="violet"
                />
              ))}
            </div>
          </Section>

          {/* ACHIEVEMENTS */}
          <Section id="achievements" >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Achievements
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-zinc-900/60 backdrop-blur-md p-6 rounded-xl border border-zinc-800 hover:border-amber-500/60 hover:bg-amber-500/5 transition-all duration-300 group relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -3, scale: 1.01 }}
                >
                  <h3 className="text-xl font-bold text-amber-100 group-hover:text-amber-300 transition-colors mb-2">
                    {item.title}
                  </h3>

                  <div className="text-amber-400 text-xs mb-3 flex items-center gap-1.5 font-mono">
                    <Calendar size={12} /> {item.date}
                  </div>

                  <p className="text-gray-400 text-xs leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </Section>

        </div>
      </main>
    </div>
  );
}