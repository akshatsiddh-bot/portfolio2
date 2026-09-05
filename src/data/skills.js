export const CATEGORIES = [
  { id: 'languages', name: 'Languages', color: '#9B5B50' },
  { id: 'frontend', name: 'Frontend', color: '#A86E62' },
  { id: 'backend', name: 'Backend', color: '#B8877A' },
  { id: 'databases', name: 'Databases', color: '#C4A68A' },
  { id: 'devops', name: 'DevOps', color: '#8B6B5E' },
  { id: 'tools', name: 'Tools', color: '#A89080' },
  { id: 'testing', name: 'Testing', color: '#9B8070' },
];

export const skills = [
  // Languages
  { id: 'c', name: 'C', category: 'languages' },
  { id: 'cpp', name: 'C++', category: 'languages' },
  { id: 'javascript', name: 'JavaScript', category: 'languages' },
  { id: 'typescript', name: 'TypeScript', category: 'languages' },
  { id: 'python', name: 'Python', category: 'languages' },
  { id: 'go', name: 'Go', category: 'languages' },
  { id: 'html', name: 'HTML', category: 'languages' },
  { id: 'css', name: 'CSS', category: 'languages' },
  { id: 'sql', name: 'SQL', category: 'languages' },

  // Frontend
  { id: 'react', name: 'React', category: 'frontend' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend' },
  { id: 'bootstrap', name: 'Bootstrap', category: 'frontend' },
  { id: 'framer-motion', name: 'Framer Motion', category: 'frontend' },
  { id: 'vite', name: 'Vite', category: 'frontend' },
  { id: 'redux', name: 'Redux', category: 'frontend' },
  { id: 'react-router', name: 'React Router', category: 'frontend' },

  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'backend' },
  { id: 'express', name: 'Express.js', category: 'backend' },
  { id: 'rest-apis', name: 'REST APIs', category: 'backend' },
  { id: 'graphql', name: 'GraphQL', category: 'backend' },

  // Databases
  { id: 'mongodb', name: 'MongoDB', category: 'databases' },
  { id: 'mysql', name: 'MySQL', category: 'databases' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'databases' },
  { id: 'redis', name: 'Redis', category: 'databases' },
  { id: 'firebase', name: 'Firebase', category: 'databases' },

  // DevOps
  { id: 'docker', name: 'Docker', category: 'devops' },
  { id: 'github-actions', name: 'GitHub Actions', category: 'devops' },
  { id: 'nginx', name: 'Nginx', category: 'devops' },
  { id: 'cicd', name: 'CI/CD', category: 'devops' },
  { id: 'aws', name: 'AWS', category: 'devops' },
  { id: 'vercel', name: 'Vercel', category: 'devops' },
  { id: 'render', name: 'Render', category: 'devops' },

  // Tools
  { id: 'git', name: 'Git', category: 'tools' },
  { id: 'github', name: 'GitHub', category: 'tools' },
  { id: 'vscode', name: 'VS Code', category: 'tools' },
  { id: 'postman', name: 'Postman', category: 'tools' },
  { id: 'npm', name: 'npm', category: 'tools' },
  { id: 'figma', name: 'Figma', category: 'tools' },
  { id: 'devtools', name: 'Chrome DevTools', category: 'tools' },

  // Testing
  { id: 'jest', name: 'Jest', category: 'testing' },
  { id: 'vitest', name: 'Vitest', category: 'testing' },
  { id: 'cypress', name: 'Cypress', category: 'testing' },
  { id: 'playwright', name: 'Playwright', category: 'testing' },
];

/** Connections between related technologies — [skillId, skillId] */
export const connections = [
  // JavaScript ecosystem
  ['javascript', 'react'],
  ['javascript', 'nodejs'],
  ['javascript', 'typescript'],
  ['javascript', 'redux'],
  ['typescript', 'react'],

  // React ecosystem
  ['react', 'redux'],
  ['react', 'react-router'],
  ['react', 'framer-motion'],
  ['react', 'tailwind'],
  ['react', 'vite'],

  // Node.js ecosystem
  ['nodejs', 'express'],
  ['nodejs', 'rest-apis'],
  ['nodejs', 'npm'],
  ['express', 'rest-apis'],
  ['express', 'graphql'],

  // Database connections
  ['mongodb', 'express'],
  ['mongodb', 'nodejs'],
  ['mysql', 'sql'],
  ['postgresql', 'sql'],
  ['redis', 'nodejs'],
  ['firebase', 'react'],

  // CSS connections
  ['css', 'tailwind'],
  ['css', 'bootstrap'],
  ['html', 'css'],
  ['html', 'react'],

  // DevOps connections
  ['docker', 'nginx'],
  ['docker', 'aws'],
  ['github', 'github-actions'],
  ['github-actions', 'cicd'],
  ['vercel', 'react'],
  ['git', 'github'],

  // Testing connections
  ['jest', 'react'],
  ['vitest', 'vite'],
  ['cypress', 'react'],
  ['playwright', 'react'],

  // Tool connections
  ['vscode', 'git'],
  ['postman', 'rest-apis'],
  ['npm', 'nodejs'],
  ['figma', 'css'],
];
