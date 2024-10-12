import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const handleHireMeClick = () => {
    alert('Thank you for considering hiring me!');
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <header className="p-5 flex justify-between items-center">
        <div className="text-3xl font-bold">K</div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" aria-label="Home" className="text-accent">Home</Link>
            </li>
            <li>
              <Link href="/about" aria-label="About Me">About</Link>
            </li>
            <li>
              <Link href="/services" aria-label="Services">Services</Link>
            </li>
            <li>
              <Link href="/portfolio" aria-label="Portfolio">Portfolio</Link>
            </li>
            <li>
              <Link href="/contact" aria-label="Contact Me">Contact Me</Link>
            </li>
            <li>
              <Link href="/case-studies" aria-label="Case Studies" className="bg-accent text-dark-bg px-4 py-2 rounded-full">Case Studies</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 flex items-center justify-between">
        <div className="max-w-xl">
          <p className="text-xl mb-4">HI THERE 👋 I&apos;M</p>
          <h1 className="text-6xl font-bold mb-4">Your Name</h1>
          <p className="text-2xl text-accent mb-4">UI/UX DESIGNER + DEVELOPER 👨‍💻</p>
          <p className="mb-6">I&apos;m a professional UI/UX designer with front-end development skills based in Your City.</p>
          <button
            onClick={handleHireMeClick}
            className="bg-accent text-dark-bg px-6 py-3 rounded-full text-lg font-semibold"
          >
            Hire Me
          </button>
        </div>
        <div className="relative">
          <Image 
            src="/your-avatar.png" 
            alt="Your Avatar" 
            width={400} 
            height={400} 
            className="rounded-full"
            placeholder="blur"
            blurDataURL="/your-placeholder.png" // Add a placeholder image URL
          />
        </div>
      </main>

      <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-green-500 rounded-full"></div>
      <div className="absolute top-2/3 right-1/3 w-12 h-12 bg-yellow-500 rounded-full"></div>
      <div className="absolute bottom-1/4 left-1/2 w-10 h-10 bg-purple-500 rounded-full"></div>
    </div>
  );
}
