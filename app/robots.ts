import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/private/', '/api/'],
            },
            {
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'OAI-SearchBot',
                    'Google-Extended',
                    'ClaudeBot',
                    'Claude-Web',
                    'PerplexityBot',
                    'Amazonbot',
                    'Applebot',
                    'cohere-ai',
                ],
                allow: '/',
            },
        ],
        sitemap: 'https://www.mithilgirish.dev/sitemap.xml',
        host: 'https://www.mithilgirish.dev',
    }
}

