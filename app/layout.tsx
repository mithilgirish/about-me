import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata, Viewport } from 'next'
import { Analytics } from "@vercel/analytics/next"
import Navbar from '@/components/navbar';


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4285F4',
} as const

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mithilgirish.dev'),

  title: 'Mithil Girish',
  description: 'Co-Founder @channelise, CSE (Data Science) Sophomore @ VIT Chennai, A Full Stack Developer with expertise in web development, graphic design, UI/UX, and game development.',

  keywords: 'Mithil Girish, Full Stack Developer, Web Development, Graphic Design, UI/UX, Game Development, React Developer, JavaScript Developer, Chennai Developer',

  authors: [{ name: 'Mithil Girish', url: 'https://www.mithilgirish.dev' }],

  icons: {
    icon: '/favicon.ico',
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.mithilgirish.dev',
    title: 'Mithil Girish - Full Stack Developer',
    description: 'A Full Stack Developer with expertise in web development, graphic design, UI/UX, and game development',
    siteName: 'Mithil Girish Portfolio',
  },

  twitter: {
    card: 'summary',
    title: 'Mithil Girish - Full Stack Developer',
    description: 'A Full Stack Developer with expertise in web development, graphic design, UI/UX, and game development',
  },

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
    canonical: 'https://www.mithilgirish.dev',
  },
} as const





export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={` min-h-screen text-white flex flex-col bg-black`}>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Mithil Girish',
              url: 'https://www.mithilgirish.dev',
              image: 'https://www.mithilgirish.dev/images/profile-pic.jpg', // Replace with actual profile image URL
              sameAs: [
                'https://github.com/mithilgirish',
                'https://linkedin.com/in/mithilgirish',
                'https://instagram.com/mithilgirish',
                'https://unsplash.com/@mithilgirish',
              ],
              jobTitle: 'Full Stack Developer',
              worksFor: {
                '@type': 'Organization',
                name: 'Channelise',
              },
            }),
          }}
        />
        <Navbar />

        <main >
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
        <footer className="text-center py-4 pb-4 bg-gray-800 bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg text-white z-20 p-2">
          {/* Glow effect */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-teal-400/10 blur-2xl opacity-30"></div>

          {/* Dotted background */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] bg-[length:10px_10px] opacity-40"></div>

          <p className="text-sm">© {new Date().getFullYear()} @mithilgirish</p>
        </footer>

      </body>
    </html>
  );
}
