import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mithil Girish',
  description: '2nd Year CSE student at VIT Chennai',
  keywords: 'Mithil Girish, VIT Chennai, Computer Science, Student, Web Development, Portfolio',
  author: 'Mithil Girish',
  og: {
    title: 'Mithil Girish',
    description: '2nd Year CSE student at VIT Chennai',
    // url: 'https://yourwebsite.com', // You can remove this line for now
    // image: 'https://yourwebsite.com/image.jpg', // You can remove this line for now
  },
};

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
        </main>
        <footer className="text-center py-3 bg-gray-800 bg-opacity-30 backdrop-blur-md rounded-lg shadow-lg text-white z-20">
        <p className="text-sm">© {new Date().getFullYear()} @mithilgirish</p>
        </footer>
      </body>
    </html>
  );
}
