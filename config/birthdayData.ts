// config/birthdayData.ts

export const floatingMessages: string[] = [
  "You deserve all the happiness in the world ❤️",
  "Keep shining ✨",
  "Another beautiful year begins...",
  "I'm so lucky to have you as my sister 🌸",
  "Today is all about you 🎂",
  "May this year be your best one yet 💖",
];

export interface MemoryItem {
  id: number;
  image: string;
  subtitle: string;
  caption: string;
  tag?: string;
}

export const memoryStory: MemoryItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
    subtitle: "Let's go back for a moment...",
    caption: "Remember this day? Still one of my favorite memories ❤️",
    tag: "Throwback 📸",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    subtitle: "The laughs & the chaos...",
    caption: "We've had some crazy moments together 😂",
    tag: "Classic Us ✨",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80",
    subtitle: "Through every year...",
    caption: "Your kindness, patience, and ability to annoy me... wouldn't trade it for the world 🌸",
    tag: "Always 💖",
  },
];