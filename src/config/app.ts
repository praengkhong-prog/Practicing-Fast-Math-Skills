// Application configuration (Laravel-like config)
export const config = {
  app: {
    name: 'Practicing Fast Math Skills',
    version: '1.0.0',
    description: 'แอปฝึกคิดเลขเร็วและพัฒนาทักษะคณิตศาสตร์',
    url: process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:5173'
  },
  
  auth: {
    passwordMinLength: 6,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },
  
  practice: {
    defaultQuestions: 10,
    timeLimit: 300, // 5 minutes in seconds
    levels: {
      easy: { min: 1, max: 10 },
      medium: { min: 10, max: 50 },
      hard: { min: 50, max: 100 }
    },
    modes: ['add', 'subtract', 'multiply', 'divide', 'mix']
  },
  
  storage: {
    buckets: {
      avatars: 'avatars'
    },
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  
  seo: {
    defaultTitle: 'Practicing Fast Math Skills - ฝึกคิดเลขเร็ว',
    defaultDescription: 'พัฒนาทักษะคณิตศาสตร์และฝึกคิดเลขเร็วอย่างสนุกสนาน',
    keywords: 'คณิตศาสตร์, ฝึกคิดเลข, เลขเร็ว, การบวก, การลบ, การคูณ, การหาร'
  }
};