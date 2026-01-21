import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Gallery | Mithil Girish',
    description: "Explore Mithil Girish's photography portfolio featuring stunning landscape, nature, and urban photography from India and beyond.",
    openGraph: {
        title: 'Photography Gallery | Mithil Girish',
        description: "Explore stunning photography by Mithil Girish. High-quality landscape and nature images available on Unsplash.",
        type: 'website',
    },
}

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
