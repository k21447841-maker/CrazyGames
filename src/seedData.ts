export const highEndGames = [
  {
    title: "Smash Karts 3D",
    description: "Multiplayer 3D kart battle arena. Blast your enemies, unlock cool characters and level up in this high-octane premium game.",
    thumbnail: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=800&auto=format&fit=crop",
    embedUrl: "https://smashkarts.io/",
    category: "Racing",
    tags: ["racing", "arena", "3d", "multiplayer", "action"]
  },
  {
    title: "Moto X3M Bike Race",
    description: "The ultimate 2D bike racing game. Incredible physics, high-speed jumps, and gorgeous premium artwork.",
    thumbnail: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
    embedUrl: "https://www.crazygames.com/embed/moto-x3m",
    category: "Racing",
    tags: ["racing", "bikes", "physics", "stunts", "2d", "kids"]
  },
  {
    title: "Duck Life: Space",
    description: "Train your duck to become a champion in space! Fun running, flying, and swimming minigames for all ages.",
    thumbnail: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format&fit=crop",
    embedUrl: "https://www.crazygames.com/embed/duck-life-space",
    category: "Action",
    tags: ["kids", "training", "adventure", "animals"]
  },
  {
    title: "Ovo",
    description: "Fast-paced platforming action. Run, slide, and jump your way through increasingly difficult levels.",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    embedUrl: "https://www.crazygames.com/embed/ovo",
    category: "Action",
    tags: ["platformer", "running", "jumping", "kids"]
  },
  {
    title: "Subway Surfers: Web",
    description: "Dash as fast as you can. Dodge the oncoming trains and obstacles in this incredible 3D endless runner.",
    thumbnail: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop",
    embedUrl: "https://www.crazygames.com/embed/subway-surf",
    category: "Action",
    tags: ["running", "kids", "endless", "3d"]
  },
  {
    title: "Monkey Mart",
    description: "Manage a cute supermarket for monkeys. Plant bananas, harvest crops, and serve your monkey customers.",
    thumbnail: "https://images.unsplash.com/photo-1620062779088-29ac364654fc?q=80&w=800&auto=format&fit=crop",
    embedUrl: "https://www.crazygames.com/embed/monkey-mart",
    category: "Puzzle",
    tags: ["management", "kids", "animals", "fun"]
  },
  {
    title: "Color Switch",
    description: "Tap to jump and bounce through matching colors. Very addictive and fun reflex game for everyone.",
    thumbnail: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop",
    embedUrl: "https://www.crazygames.com/embed/color-switch",
    category: "Action",
    tags: ["kids", "colors", "timing", "jumping"]
  },
  {
    title: "Puppy Sling",
    description: "Drag and release to sling the puppy to safety! Adorable puzzle game that is perfect for kids.",
    thumbnail: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop",
    embedUrl: "https://www.crazygames.com/embed/puppy-sling",
    category: "Puzzle",
    tags: ["puzzle", "physics", "kids", "dogs"]
  },
  {
    title: "Paper.io 2",
    description: "Conquer as much territory as possible. Draw shapes to claim space in this addictive classic hit.",
    thumbnail: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop",
    embedUrl: "https://www.crazygames.com/embed/paper-io-2",
    category: "Action",
    tags: ["multiplayer", "kids", "drawing", "hit"]
  },
  {
    title: "Draw Climber",
    description: "Draw legs for your cube so it can run! Race against others in this fun and creative platformer.",
    thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
    embedUrl: "https://www.crazygames.com/embed/draw-climber",
    category: "Racing",
    tags: ["drawing", "kids", "racing", "creative"]
  }
];

export const generateMoreGames = () => {
  const kidFriendlyEmbeds = [
    "https://www.crazygames.com/embed/smash-karts",
    "https://www.crazygames.com/embed/moto-x3m",
    "https://www.crazygames.com/embed/subway-surf",
    "https://www.crazygames.com/embed/monkey-mart",
    "https://www.crazygames.com/embed/color-switch",
    "https://www.crazygames.com/embed/paper-io-2",
    "https://www.crazygames.com/embed/ovo",
    "https://www.crazygames.com/embed/draw-climber",
    "https://www.crazygames.com/embed/blocky-cars",
    "https://www.crazygames.com/embed/temple-run-2",
    "https://www.crazygames.com/embed/fireboy-and-watergirl-the-forest-temple",
    "https://www.crazygames.com/embed/cut-the-rope",
    "https://www.crazygames.com/embed/papas-pizzeria",
    "https://www.crazygames.com/embed/snail-bob",
    "https://www.crazygames.com/embed/happy-glass"
  ];

  const funWords = ["Magic", "Super", "Happy", "Jumping", "Crazy", "Bouncy", "Flying", "Tiny", "Giant", "Adventure"];
  const animals = ["Puppy", "Kitten", "Dragon", "Monkey", "Penguin", "Panda", "Unicorn", "Dino", "Turtle", "Robot"];
  const actions = ["Dash", "Run", "Jump", "Pop", "Blast", "Merge", "Builder", "Racer", "Quest", "World"];

  const extraGames = [];
  
  for(let i=0; i<40; i++) {
    const embedUrl = kidFriendlyEmbeds[i % kidFriendlyEmbeds.length];
    const title = `${funWords[i % funWords.length]} ${animals[i % animals.length]} ${actions[i % actions.length]}`;
    const category = i % 2 === 0 ? "Action" : (i % 3 === 0 ? "Puzzle" : "Racing");
    
    extraGames.push({
      title: title,
      description: `A very addictive and fun ${category.toLowerCase()} game for kids. Play as a ${animals[i % animals.length]} and explore the amazing world!`,
      thumbnail: `https://images.unsplash.com/photo-${1500000000000 + i * 2000000}?q=80&w=800&auto=format&fit=crop`,
      embedUrl: embedUrl,
      category: category,
      tags: ["kids", "fun", "colorful", animals[i % animals.length].toLowerCase()]
    });
  }
  
  return [...highEndGames, ...extraGames];
};
