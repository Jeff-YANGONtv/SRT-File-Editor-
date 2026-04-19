import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // ဒီလမ်းကြောင်း မှန်ဖို့ အရေးကြီးဆုံးပါ
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617", // အစ်ကို့ရဲ့ Premium Dark Mode အရောင်
      },
    },
  },
  plugins: [],
};
export default config;