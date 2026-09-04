import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Experience',
    description: 'Professional journey of Mithil Girish: SDE Intern at FinkAI, Project Intern at ANNAM.AI, Project Intern at Indira Gandhi Centre for Atomic Research (IGCAR), and Co-Founder at Channelise.',
    alternates: {
        canonical: 'https://www.mithilgirish.dev/experience',
    },
    openGraph: {
        title: 'Experience | Mithil Girish',
        description: 'Career timeline of Mithil Girish: SDE Intern at FinkAI, research at ANNAM.AI, Department of Atomic Energy (IGCAR), and Channelise.',
        url: 'https://www.mithilgirish.dev/experience',
        type: 'website',
        images: [
            {
                url: '/images/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Mithil Girish Experience Timeline',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Experience | Mithil Girish',
        description: 'Career timeline of Mithil Girish: SDE Intern at FinkAI, research at ANNAM.AI, Department of Atomic Energy (IGCAR), and Channelise.',
        images: ['/images/og-image.png'],
    },
}

export default function ExperienceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

