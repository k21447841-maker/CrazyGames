export const mockDb = {
  games: [
    {
      _id: "1",
      title: "Neon Racing",
      description: "A fast-paced retro futuristic racing game.",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
      embedUrl: "https://www.retrogames.cc/embed/41668-neon-racer.html",
      category: "Racing",
      tags: ["retro", "driving", "fast"],
      active: true,
      plays: 1205,
      rating: 4.5,
      ratingCount: 10,
      createdAt: new Date().toISOString()
    },
    {
      _id: "2",
      title: "Galactic Puzzle",
      description: "Solve mind-bending puzzles in space.",
      thumbnail: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?auto=format&fit=crop&q=80&w=800",
      embedUrl: "https://html5.gamedistribution.com/rvvASMiM/5e73efb1c06d4e8bb247e682d33458ff/",
      category: "Puzzle",
      tags: ["space", "logic", "casual"],
      active: true,
      plays: 852,
      rating: 4.8,
      ratingCount: 5,
      createdAt: new Date().toISOString()
    }
  ],
  adSettings: {
    _id: "1",
    adsEnabled: true,
    bannerEnabled: true,
    interstitialEnabled: false,
    videoEnabled: false,
    adsterraPublisherId: "",
    updatedAt: new Date().toISOString()
  }
};
