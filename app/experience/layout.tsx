import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Experience | Mithil Girish',
    description: 'Professional journey and work experience of Mithil Girish. Co-Founder of Channelise, and roles at leading tech organizations.',
    openGraph: {
        title: 'Professional Experience | Mithil Girish',
        description: 'View my career timeline, from co-founding Channelise to my current role as a CSE student at VIT Chennai.',
        type: 'website',
    },
}

export default function ExperienceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
