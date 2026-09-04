import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Gallery',
    description: "Photography portfolio of Mithil Girish. Over 700,000+ views on Unsplash, featuring architectural symmetry, natural landscapes, and high-precision visual frames.",
    alternates: {
        canonical: 'https://www.mithilgirish.dev/gallery',
    },
    openGraph: {
        title: 'Gallery | Mithil Girish',
        description: "Photography portfolio of Mithil Girish with over 700,000+ views on Unsplash. Explore architectural, landscape, and urban visuals.",
        url: 'https://www.mithilgirish.dev/gallery',
        type: 'website',
        images: [
            {
                url: '/images/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Mithil Girish Photography Portfolio',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Gallery | Mithil Girish',
        description: "Photography portfolio of Mithil Girish with over 700,000+ views on Unsplash. Explore architectural, landscape, and urban visuals.",
        images: ['/images/og-image.png'],
    },
}

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

