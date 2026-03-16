export const siteConfig = {
  name: "Placeholder Image Generator",
  title: "Placeholder Image Generator - Create Custom Placeholder Images Instantly",
  description: "Generate custom placeholder images with configurable dimensions, colors, text, and formats. Download as PNG, JPEG, or SVG. 100% free, no signup, runs entirely in your browser.",
  url: "https://placeholder-image-generator.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "Image",
  brandAccentColor: "#ec4899",

  keywords: [
    "placeholder image generator",
    "dummy image creator",
    "placeholder images",
    "custom placeholder",
    "image placeholder tool",
    "mockup image generator",
    "wireframe placeholder",
    "design placeholder",
    "free placeholder images",
    "placeholder image API alternative",
  ],
  applicationCategory: "DesignApplication",

  themeColor: "#a855f7",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: [
    "https://twitter.com/Dharmendra_Jago",
    "https://github.com/Jagodana-Studio-Private-Limited",
    "https://www.linkedin.com/company/jagodana-llc",
  ],

  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/placeholder-image-generator",
    website: "https://jagodana.com",
  },

  footer: {
    about: "Placeholder Image Generator creates custom placeholder images instantly in your browser. Perfect for mockups, wireframes, and prototyping — no signup or API keys needed.",
    featuresTitle: "Features",
    features: [
      "Custom dimensions & presets",
      "Configurable colors & text",
      "PNG, JPEG & SVG export",
      "100% client-side processing",
    ],
  },

  hero: {
    badge: "Free & No Signup Required",
    titleLine1: "Generate Custom",
    titleGradient: "Placeholder Images",
    subtitle: "Create pixel-perfect placeholder images for your mockups, wireframes, and prototypes. Choose dimensions, colors, text — download instantly as PNG, JPEG, or SVG.",
  },

  featureCards: [
    {
      icon: "📐",
      title: "Any Size You Need",
      description: "Choose from common presets (1920×1080, 800×600, etc.) or enter any custom dimensions up to 4096px.",
    },
    {
      icon: "🎨",
      title: "Fully Customizable",
      description: "Pick background and text colors, add custom text overlays, and adjust font size to match your design.",
    },
    {
      icon: "⬇️",
      title: "Multiple Formats",
      description: "Export as PNG, JPEG, or SVG. Copy to clipboard with one click or download directly to your device.",
    },
  ],

  relatedTools: [
    {
      name: "Screenshot Beautifier",
      url: "https://screenshot-beautifier.tools.jagodana.com",
      icon: "📸",
      description: "Transform screenshots into beautiful images.",
    },
    {
      name: "Favicon Generator",
      url: "https://favicon-generator.tools.jagodana.com",
      icon: "🎨",
      description: "Generate all favicon sizes + manifest from any image.",
    },
    {
      name: "Color Palette Explorer",
      url: "https://color-palette-explorer.tools.jagodana.com",
      icon: "🎭",
      description: "Extract color palettes from any image.",
    },
    {
      name: "Aspect Ratio Calculator",
      url: "https://aspect-ratio-calculator.tools.jagodana.com",
      icon: "📏",
      description: "Calculate and convert aspect ratios for any resolution.",
    },
    {
      name: "Logo Maker",
      url: "https://logo-maker.tools.jagodana.com",
      icon: "✏️",
      description: "Create a professional logo in 60 seconds.",
    },
    {
      name: "Image Color Extractor",
      url: "https://image-color-extractor.tools.jagodana.com",
      icon: "🔍",
      description: "Extract dominant colors from any image.",
    },
  ],

  howToSteps: [
    { name: "Set Dimensions", text: "Choose a preset size or enter custom width and height values for your placeholder image.", url: "" },
    { name: "Customize Appearance", text: "Pick background color, text color, and optionally add custom overlay text.", url: "" },
    { name: "Export Your Image", text: "Download as PNG, JPEG, or SVG, or copy directly to clipboard with one click.", url: "" },
  ],
  howToTotalTime: "PT1M",

  faq: [
    {
      question: "Is this placeholder image generator free?",
      answer: "Yes, completely free with no signup required. All images are generated in your browser — nothing is uploaded to any server.",
    },
    {
      question: "What image formats are supported?",
      answer: "You can export placeholder images as PNG (lossless), JPEG (smaller file size), or SVG (scalable vector format perfect for responsive designs).",
    },
    {
      question: "What is the maximum image size?",
      answer: "You can generate images up to 4096×4096 pixels. This covers virtually all use cases from thumbnails to high-resolution displays.",
    },
    {
      question: "Can I use these images in commercial projects?",
      answer: "Absolutely. Placeholder images generated by this tool are yours to use however you want — personal projects, commercial work, client mockups, etc.",
    },
    {
      question: "How is this different from placeholder.com or similar services?",
      answer: "Unlike external placeholder services, this tool runs entirely in your browser. No API calls, no rate limits, no dependency on third-party servers. Your images are generated instantly offline.",
    },
  ],

  pages: {
    "/": {
      title: "Placeholder Image Generator - Create Custom Placeholder Images Instantly",
      description: "Generate custom placeholder images with configurable dimensions, colors, text, and formats. Download as PNG, JPEG, or SVG. 100% free, runs in your browser.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
