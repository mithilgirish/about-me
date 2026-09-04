import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Projects',
    description: 'Engineering portfolio of Mithil Girish, featuring traz (Rust + Go context engine), Apache Iceberg Go contributions, PACTUS (microservices on Hedera), AgroFlow, and Channelise.',
    alternates: {
        canonical: 'https://www.mithilgirish.dev/projects',
    },
    openGraph: {
        title: 'Projects | Mithil Girish',
        description: 'Explore engineering projects by Mithil Girish: traz, Apache Iceberg Go, PACTUS, AgroFlow, and scalable distributed architectures.',
        url: 'https://www.mithilgirish.dev/projects',
        type: 'website',
        images: [
            {
                url: '/images/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Mithil Girish Projects Portfolio',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Projects | Mithil Girish',
        description: 'Explore engineering projects by Mithil Girish: traz, Apache Iceberg Go, PACTUS, AgroFlow, and scalable distributed architectures.',
        images: ['/images/og-image.png'],
    },
}

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

