const mongoose = require('mongoose');
require('dotenv').config();

const Influencer = require('../models/Influencer');
const Post = require('../models/Post');
const Reel = require('../models/Reel');

// Sample data - COMPLETE ACTUAL DATA
const influencersData = [
  {
    name: "Emma Johnson",
    username: "emmastyle",
    profilePicture: "//images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop&crop=face",
    followers: 2500000,
    following: 1800,
    postsCount: 1240,
    bio: "Fashion & Lifestyle Blogger ✨ Sharing my daily style & travel adventures 📍 NYC",
    verified: true,
    category: "Fashion",
    engagement: {
      averageLikes: 125000,
      averageComments: 3200,
      engagementRate: 5.1
    },
    demographics: {
      gender: { female: 78, male: 20, other: 2 },
      ageGroups: { '18-24': 35, '25-34': 40, '35-44': 18, '45-54': 5, '55+': 2 },
      geography: [
        { country: 'United States', percentage: 45 },
        { country: 'Canada', percentage: 12 },
        { country: 'United Kingdom', percentage: 10 },
        { country: 'Australia', percentage: 8 },
        { country: 'Germany', percentage: 6 },
        { country: 'France', percentage: 5 },
        { country: 'India', percentage: 4 },
        { country: 'Brazil', percentage: 10 }
      ]
    }
  },
  {
    name: "Alex Chen",
    username: "alexfitness",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    followers: 1800000,
    following: 950,
    postsCount: 892,
    bio: "Fitness Coach & Nutritionist 💪 Transforming lives through fitness 🏋️‍♂️ Online coaching available",
    verified: true,
    category: "Fitness",
    engagement: {
      averageLikes: 89000,
      averageComments: 2100,
      engagementRate: 5.8
    },
    demographics: {
      gender: { male: 55, female: 43, other: 2 },
      ageGroups: { '18-24': 25, '25-34': 45, '35-44': 22, '45-54': 6, '55+': 2 },
      geography: [
        { country: 'United States', percentage: 38 },
        { country: 'United Kingdom', percentage: 15 },
        { country: 'Canada', percentage: 12 },
        { country: 'Australia', percentage: 10 },
        { country: 'India', percentage: 8 },
        { country: 'Germany', percentage: 7 },
        { country: 'Brazil', percentage: 5 },
        { country: 'Japan', percentage: 5 }
      ]
    }
  },
  {
    name: "Sarah Martinez",
    username: "sarahtravel",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    followers: 3200000,
    following: 2100,
    postsCount: 1580,
    bio: "Travel Blogger ✈️ Exploring the world one country at a time 🌍 DM for collabs",
    verified: true,
    category: "Travel",
    engagement: {
      averageLikes: 156000,
      averageComments: 4200,
      engagementRate: 5.5
    },
    demographics: {
      gender: { female: 65, male: 33, other: 2 },
      ageGroups: { '18-24': 30, '25-34': 38, '35-44': 20, '45-54': 8, '55+': 4 },
      geography: [
        { country: 'United States', percentage: 40 },
        { country: 'United Kingdom', percentage: 15 },
        { country: 'Germany', percentage: 10 },
        { country: 'Australia', percentage: 9 },
        { country: 'Canada', percentage: 8 },
        { country: 'France', percentage: 6 },
        { country: 'Italy', percentage: 6 },
        { country: 'Spain', percentage: 6 }
      ]
    }
  }
];

const postsData = [
  {
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop",
    caption: "Sunday brunch vibes in this gorgeous floral dress! ✨ Can't get enough of these spring colors 🌸 #SundayStyle #FloralDress #SpringFashion",
    analysis: {
      keywords: ["fashion", "dress", "brunch", "spring", "floral"],
      vibe: "aesthetic",
      quality: {
        lighting: "excellent",
        visualAppeal: 9,
        consistency: "high"
      }
    }
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop",
    caption: "New workout gear from @activebrand 💪 Ready to crush this Monday! Who's joining me for a morning run? #MondayMotivation #FitnessJourney",
    analysis: {
      keywords: ["fitness", "workout", "activewear", "motivation", "running"],
      vibe: "energetic",
      quality: {
        lighting: "good",
        visualAppeal: 8,
        consistency: "high"
      }
    }
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop",
    caption: "Paradise found! 🏝️ This hidden beach in Bali is absolutely breathtaking. Swipe to see more views! #TravelGoals #Bali #BeachVibes",
    analysis: {
      keywords: ["travel", "beach", "bali", "nature", "paradise"],
      vibe: "aesthetic",
      quality: {
        lighting: "excellent",
        visualAppeal: 10,
        consistency: "high"
      }
    }
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=400&fit=crop",
    caption: "Homemade pasta night 🍝 Recipe in stories! This creamy carbonara is to die for 😋 #Foodie #PastaNight #HomeCooking",
    analysis: {
      keywords: ["food", "pasta", "cooking", "homemade", "recipe"],
      vibe: "casual",
      quality: {
        lighting: "good",
        visualAppeal: 8,
        consistency: "medium"
      }
    }
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
    caption: "New collection drop! 👗 These pieces are everything I've been dreaming of. Link in bio to shop! #Fashion #NewCollection #StyleInspo",
    analysis: {
      keywords: ["fashion", "shopping", "style", "clothing", "collection"],
      vibe: "luxury",
      quality: {
        lighting: "excellent",
        visualAppeal: 9,
        consistency: "high"
      }
    }
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    caption: "Leg day crushing it! 🔥 Remember, consistency is key. You've got this! 💪 #FitnessMotivation #GymLife #LegDay",
    analysis: {
      keywords: ["fitness", "gym", "workout", "motivation", "training"],
      vibe: "energetic",
      quality: {
        lighting: "average",
        visualAppeal: 7,
        consistency: "high"
      }
    }
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    caption: "Mountain therapy 🏔️ Sometimes you just need to disconnect and breathe in the fresh air. #MountainLife #NatureLovers #Wanderlust",
    analysis: {
      keywords: ["nature", "mountains", "travel", "adventure", "hiking"],
      vibe: "aesthetic",
      quality: {
        lighting: "excellent",
        visualAppeal: 10,
        consistency: "high"
      }
    }
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1551871812-10ecc21ffa2f?w=400&h=400&fit=crop",
    caption: "Coffee and planning my week ☕ What are your goals for this week? Let me know below! #MondayVibes #ProductivityTips #CoffeeLover",
    analysis: {
      keywords: ["lifestyle", "coffee", "planning", "productivity", "morning"],
      vibe: "casual",
      quality: {
        lighting: "good",
        visualAppeal: 7,
        consistency: "medium"
      }
    }
  }
];

const reelsData = [
  {
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    caption: "Get ready with me for a night out! ✨ Which look do you prefer? Comment 1 or 2! #GRWM #NightOut #MakeupTutorial",
    duration: 45,
    analysis: {
      events: ["getting ready", "outfit change", "makeup application"],
      objects: ["mirror", "cosmetics", "clothing", "accessories"],
      vibe: "party",
      tags: ["beauty", "fashion", "nightlife", "makeup"],
      setting: "indoor"
    }
  },
  {
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    caption: "30-minute HIIT workout you can do at home! 🔥 Save this for later 💪 #HomeWorkout #HIIT #FitnessReels",
    duration: 62,
    analysis: {
      events: ["exercising", "demonstrating moves", "counting reps"],
      objects: ["yoga mat", "dumbbells", "water bottle"],
      vibe: "workout",
      tags: ["fitness", "home workout", "HIIT", "exercise"],
      setting: "home"
    }
  },
  {
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop",
    caption: "Best sunset views in Santorini 🌅 Would you visit? #Travel #Santorini #SunsetViews #TravelReels",
    duration: 38,
    analysis: {
      events: ["sunset watching", "scenic views", "walking"],
      objects: ["buildings", "ocean", "sky", "people"],
      vibe: "travel luxury",
      tags: ["travel", "sunset", "luxury", "europe"],
      setting: "outdoor"
    }
  },
  {
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=600&fit=crop",
    caption: "Easy 15-minute meal prep! 🍱 Perfect for busy weekdays. Save this recipe! #MealPrep #HealthyEating #QuickRecipes",
    duration: 55,
    analysis: {
      events: ["cooking", "chopping vegetables", "meal preparation"],
      objects: ["knife", "vegetables", "containers", "cutting board"],
      vibe: "cooking",
      tags: ["food", "cooking", "meal prep", "healthy"],
      setting: "home"
    }
  },
  {
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=600&fit=crop",
    caption: "Dance challenge! Who's doing this with me? 💃 Tag a friend! #DanceChallenge #Trending #FunReels",
    duration: 28,
    analysis: {
      events: ["dancing", "choreography", "performing"],
      objects: ["phone", "music", "background"],
      vibe: "dance",
      tags: ["dance", "trending", "fun", "challenge"],
      setting: "indoor"
    }
  },
  {
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=600&fit=crop",
    caption: "A day in my life as a content creator! 📸 Behind the scenes of what I really do! #DayInMyLife #ContentCreator #BTS",
    duration: 71,
    analysis: {
      events: ["working", "filming", "editing", "daily routine"],
      objects: ["camera", "laptop", "phone", "notebook"],
      vibe: "casual daily life",
      tags: ["lifestyle", "work", "behind the scenes", "creator"],
      setting: "indoor"
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/influencer_db');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Influencer.deleteMany({});
    await Post.deleteMany({});
    await Reel.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create influencers
    const createdInfluencers = await Influencer.insertMany(influencersData);
    console.log(`✅ Created ${createdInfluencers.length} influencers`);

    // Create posts for each influencer
    for (let i = 0; i < createdInfluencers.length; i++) {
      const influencer = createdInfluencers[i];
      const postsForInfluencer = [];

      for (let j = 0; j < 15; j++) {
        const basePost = postsData[j % postsData.length];
        postsForInfluencer.push({
          ...basePost,
          influencerId: influencer._id,
          likes: Math.floor(Math.random() * 200000) + 50000,
          comments: Math.floor(Math.random() * 5000) + 1000,
          views: Math.floor(Math.random() * 1000000) + 200000,
          postDate: new Date(Date.now() - j * 24 * 60 * 60 * 1000),
        });
      }

      await Post.insertMany(postsForInfluencer);
      console.log(`✅ Created ${postsForInfluencer.length} posts for ${influencer.name}`);
    }

    // Create reels for each influencer
    for (let i = 0; i < createdInfluencers.length; i++) {
      const influencer = createdInfluencers[i];
      const reelsForInfluencer = [];

      for (let j = 0; j < 8; j++) {
        const baseReel = reelsData[j % reelsData.length];
        reelsForInfluencer.push({
          ...baseReel,
          influencerId: influencer._id,
          views: Math.floor(Math.random() * 3000000) + 500000,
          likes: Math.floor(Math.random() * 200000) + 30000,
          comments: Math.floor(Math.random() * 10000) + 2000,
          shares: Math.floor(Math.random() * 15000) + 3000,
          postDate: new Date(Date.now() - j * 3 * 24 * 60 * 60 * 1000),
        });
      }

      await Reel.insertMany(reelsForInfluencer);
      console.log(`✅ Created ${reelsForInfluencer.length} reels for ${influencer.name}`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Influencers: ${createdInfluencers.length}`);
    console.log(`   - Posts: ${createdInfluencers.length * 15}`);
    console.log(`   - Reels: ${createdInfluencers.length * 8}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();