/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        forest: "#2E7D32",   // Forest green
        leaf: "#66BB6A",     // Leaf green
        sky: "#4FC3F7",      // Sky blue
        sand: "#F5E6C4",     // Sand/beige
        earth: "#8D6E63",    // Warm brown
        // Keep existing colors for backward compatibility, but alias them to earthy where applicable
        primary: "#2E7D32",  // Re-map primary to forest
        secondary: "#66BB6A",// Re-map secondary to leaf
        danger: "#dc2626",   // red-600
        background: "#F5E6C4", // Use sand for subtle backgrounds
        card: "#ffffff",
        text: "#1f2937",     // gray-800
        muted: "#6b7280",    // gray-500
      },
    },
  },
  plugins: [],
}
