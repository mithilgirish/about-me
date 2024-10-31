import './globals.css';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });


export const metadata = {
  // Basic Metadata
  title: 'Mithil Girish',
  description: '2nd Year CSE student at VIT Chennai',
  // Extended Meta Tags
  keywords: 'Mithil Girish, VIT Chennai, Computer Science Engineering, Full Stack Developer, Web Development, Student Portfolio, Software Engineering, React Developer, JavaScript Developer, Chennai Developer',
  author: 'Mithil Girish',
  
  
  // Additional SEO Tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },

  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mithilgirish.dev',
  },
}



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen text-white flex flex-col`}>
        <header className="p-3  z-20 relative">
          <nav className="flex justify-end space-x-8">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="/projects" className="text-gray-300 hover:text-white transition-colors">Projects</a>
            <a href="/gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</a>
          </nav>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8 ">
          {children}
          <SpeedInsights />
        </main>
        <footer className="text-center py-3 bg-gray-800 bg-opacity-30 backdrop-blur-md rounded-lg shadow-lg text-white z-20">
        <p className="text-sm">© {new Date().getFullYear()} @mithilgirish</p>
        </footer>
      </body>
    </html>
  );
}
