/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false
  },
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [],
  safelist: [
    {
      pattern: /grid-cols-(2|6|12)/
    },
    {
      pattern: /col-span-(1|2|3|4|6|12)/
    }
  ]
}
