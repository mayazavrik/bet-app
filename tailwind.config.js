/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            light: '#4096ff',
            DEFAULT: '#1677ff',
            dark: '#0958d9',
          },
          secondary: {
            light: '#9254de',
            DEFAULT: '#722ed1',
            dark: '#531dab',
          },
          success: {
            light: '#73d13d',
            DEFAULT: '#52c41a',
            dark: '#389e0d',
          },
          warning: {
            light: '#faad14',
            DEFAULT: '#faad14',
            dark: '#d48806',
          },
          error: {
            light: '#ff7875',
            DEFAULT: '#ff4d4f',
            dark: '#d9363e',
          },
        },
        animation: {
          'balance-change': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1)',
        },
      },
    },
    plugins: [],
    corePlugins: {
      preflight: false, // Отключаем префлайт, чтобы не конфликтовал с Ant Design
    },
  }