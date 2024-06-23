import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        headings: "#1C1C1C",
        links: "#2D74BB",
        caption: "#717171",
        body: "#555555",
        cream: "#F6F6F1",
        gh_navy: "#10235A",
        page: "#EFEFE7",
        gh_green: {
          50: '#E6ECED',
          100: '#B2C5C8',
          200: '#8CA9AD',
          300: '#588188',
          400: '#386971',
          500: '#06434D',
          600: '#053D46',
          700: '#043037',
          800: '#03252A',
          900: '#031C20',
        },
      },
      backgroundImage: {
        'logo': "url(/public/logos/color-horizontal.png) no-repeat",
      },
    },
    plugins: [],
  },
  plugins: [],
};
export default config;
