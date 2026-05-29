import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0e1116',
        paper: '#f5f1e8',
        sand: '#d6c7a8',
        moss: '#3d5a46',
        ember: '#c95f3d'
      },
      boxShadow: {
        halo: '0 20px 80px rgba(14, 17, 22, 0.12)'
      },
      backgroundImage: {
        grain: 'radial-gradient(circle at top, rgba(255,255,255,0.34), transparent 46%), linear-gradient(135deg, #f5f1e8 0%, #efe6d4 100%)'
      }
    }
  },
  plugins: []
};

export default config;