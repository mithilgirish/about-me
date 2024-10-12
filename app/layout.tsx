// app/layout.tsx

import './globals.css';

export const metadata = {
  title: 'My Portfolio',
  description: 'A showcase of my skills and projects',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/gallery">Gallery</a></li>
            {/* Add other navigation links here */}
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
