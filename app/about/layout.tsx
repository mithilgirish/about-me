import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About',
    description: 'Learn about Mithil Girish - Software Engineer and Data Scientist specializing in Edge AI, Context Engines, and Distributed Systems. SDE Intern at FinkAI, studying at VIT Chennai.',
    alternates: {
        canonical: 'https://www.mithilgirish.dev/about',
    },
    openGraph: {
        title: 'About | Mithil Girish',
        description: 'Software Engineer & Data Scientist specializing in Edge AI, Context Engines, and Distributed Systems. Read bio, education, and technical arsenal.',
        url: 'https://www.mithilgirish.dev/about',
        type: 'profile',
        images: [
            {
                url: '/images/og-image.png',
                width: 1200,
                height: 630,
                alt: 'About Mithil Girish',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About | Mithil Girish',
        description: 'Software Engineer & Data Scientist specializing in Edge AI, Context Engines, and Distributed Systems. Read bio, education, and technical arsenal.',
        images: ['/images/og-image.png'],
    },
}

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

