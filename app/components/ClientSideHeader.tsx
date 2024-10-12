'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function ClientSideHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-black text-amber-300 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Name</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
          <ul className="md:flex space-y-2 md:space-y-0 md:space-x-4">
            <li><Link href="/about" className="hover:text-amber-100">About</Link></li>
            <li><Link href="/contact" className="hover:text-amber-100">Contact</Link></li>
            <li><Link href="/projects" className="hover:text-amber-100">Projects</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}