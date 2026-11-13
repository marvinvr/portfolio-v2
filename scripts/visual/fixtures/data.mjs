export const fixedTime = '2026-01-15T12:00:00.000Z';
export const whoop = {
  recovery: { latest: 82, monthly: 74, annual: 71 },
  strain: { latest: 13, monthly: 11, annual: 10 },
  hrv: { latest: 68, monthly: 62, annual: 60 },
  rhr: { latest: 52, monthly: 54, annual: 55 },
  sleepEfficiency: { latest: 94, monthly: 91, annual: 90 },
  sleepDuration: { latest: 7.8, monthly: 7.4, annual: 7.2 },
  lastUpdated: fixedTime,
};
export const youtube = {
  playlistUrl: 'https://www.youtube.com/playlist?list=visual-fixture',
  videos: [
    ['building-tools', 'Building useful tools with AI', 'A practical look at building and shipping a small software project.'],
    ['industrial-ai', 'Industrial AI in practice', 'Turning machine learning experiments into reliable products.'],
    ['developer-setup', 'My everyday developer setup', 'The tools and habits I use to stay focused while building.'],
  ].map(([id, title, description]) => ({ id, title, description,
    thumbnail: '/og-image.png', publishedAt: '2025-12-01T12:00:00.000Z',
    url: `https://www.youtube.com/watch?v=${id}`,
  })),
};
