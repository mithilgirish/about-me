import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Projects | Mithil Girish',
    description: 'Showcase of my latest projects in Full Stack Development, App Development, and AI. Featuring work with Next.js, React Native, and Python.',
    openGraph: {
        title: 'Projects | Mithil Girish',
        description: 'Explore my portfolio of web and mobile applications, including hackathon wins and personal projects.',
        type: 'website',
    },
}

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
