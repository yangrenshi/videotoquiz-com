import { MetadataRoute } from 'next';
import topicsData from '@/data/pseo-topics.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.videotoquiz.com';
  const currentDate = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/for/medical-students`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/topics`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // 46 个高商业价值核心 pSEO 专题页面 (重点页面提权至 0.95 强引蜘蛛抓取)
  const highPrioritySlugs = [
    'the-cherno-cpp-game-engine-quiz',
    'traversy-media-web-dev-quiz',
  ];

  const topicRoutes: MetadataRoute.Sitemap = topicsData.map((item) => {
    const isHighPriority = highPrioritySlugs.includes(item.slug);
    return {
      url: `${baseUrl}/topics/${item.slug}`,
      lastModified: currentDate,
      changeFrequency: isHighPriority ? 'daily' : 'weekly',
      priority: isHighPriority ? 0.95 : 0.8,
    };
  });

  return [...staticRoutes, ...topicRoutes];
}
