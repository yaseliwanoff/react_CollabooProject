/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js, ts, jsx, tsx}",
  ],
  theme: {
    screens: {
      sm: "300px",
      md: "956px",
      lg: "1360px",
    },
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "20px",
          sm: "20px",
          md: "20px",
          lg: "80px",
        },
        screens: {
          sm: "374px",
          md: "956px",
          lg: "1360px",
        },
      },
    },
  },
}