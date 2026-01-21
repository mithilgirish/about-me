import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Me | Mithil Girish',
    description: 'Learn more about Mithil Girish - A Full Stack Developer and Designer based in Chennai. Discover my skills, background, and passion for technology.',
    openGraph: {
        title: 'About Mithil Girish',
        description: 'Full Stack Developer, Designer, and Tech Enthusiast. Read my bio and check out my technical arsenal.',
        type: 'profile',
    },
}

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
