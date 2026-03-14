// blogData.js

// Sample blog data for past events
export const blogPosts = [
  {
    id: 1,
    eventId: 1,
    eventName: "Annual Science Fair 2025",
    organizer: "Science Club",
    spot: "Central Auditorium",
    date: "2025-12-15",
    title: "A Spectacular Journey Through Innovation at Science Fair 2025",
    author: "Dr. Sarah Ahmed",
    summary:
      "The Annual Science Fair 2025 showcased groundbreaking projects from students across all departments, featuring AI innovations, sustainable energy solutions, and biotechnology breakthroughs.",
    content:
      "The Annual Science Fair 2025 was a remarkable celebration of scientific excellence and innovation. Over 150 projects were presented by talented students from various departments, demonstrating the cutting-edge research and creative problem-solving skills developed at SUST. The event attracted over 2,000 visitors including industry professionals, academics, and science enthusiasts.",
    scheduleFragments: [
      {
        time: "09:00 AM",
        activity: "Opening Ceremony",
        description: "Welcome speech by Vice Chancellor and keynote from Nobel Laureate Dr. Rahman",
      },
      {
        time: "10:30 AM",
        activity: "Project Presentations - Session 1",
        description: "AI & Machine Learning innovations",
      },
      { time: "01:00 PM", activity: "Lunch Break & Networking", description: "Interaction with industry experts" },
      {
        time: "02:30 PM",
        activity: "Project Presentations - Session 2",
        description: "Sustainable Energy & Biotechnology",
      },
      { time: "05:00 PM", activity: "Award Ceremony", description: "Recognition of outstanding projects" },
      { time: "06:30 PM", activity: "Closing Remarks", description: "Thank you note and future announcements" },
    ],
    images: [
      {
        url: "/science-fair-opening-ceremony-with-students-and-fa.jpg",
        caption: "Opening ceremony with distinguished guests",
        alt: "Science Fair opening ceremony",
      },
      {
        url: "/students-presenting-ai-project-with-robotic-demons.jpg",
        caption: "AI robotics project demonstration",
        alt: "AI project presentation",
      },
      { url: "/sustainable-energy-solar-panel-project-display.jpg", caption: "Award-winning solar energy project", alt: "Solar energy project" },
      { url: "/science-fair-award-ceremony-with-trophy-presentati.jpg", caption: "Award ceremony celebrating excellence", alt: "Award ceremony" },
    ],
    tags: ["Science", "Innovation", "Research", "Technology"],
  },
  {
    id: 2,
    eventId: 2,
    eventName: "Music Night Harmony 2025",
    organizer: "Music Club",
    spot: "Mini Auditorium",
    date: "2025-11-20",
    title: "Melodies That Touched Hearts: Music Night Harmony 2025 Recap",
    author: "Tanvir Hassan",
    summary:
      "An enchanting evening of musical performances featuring classical, contemporary, and fusion genres that brought together music lovers from across the university.",
    content:
      "Music Night Harmony 2025 was an unforgettable evening that transformed the Mini Auditorium into a mesmerizing concert hall. The event featured performances by both student bands and solo artists, covering diverse musical genres from classical ragas to modern rock. The audience was treated to soulful renditions, energetic performances, and heartwarming collaborations.",
    scheduleFragments: [
      { time: "06:00 PM", activity: "Sound Check & Rehearsal", description: "Final preparations by performers" },
      { time: "07:00 PM", activity: "Welcome & Introduction", description: "Opening remarks by Music Club President" },
      {
        time: "07:30 PM",
        activity: "Classical Performances",
        description: "Traditional instruments and vocal performances",
      },
      { time: "08:30 PM", activity: "Contemporary & Rock Sets", description: "Student band performances" },
      { time: "09:45 PM", activity: "Fusion Collaboration", description: "Special collaborative performance" },
      { time: "10:30 PM", activity: "Closing Performance", description: "Grand finale with all performers" },
    ],
    images: [
      {
        url: "/music-concert-stage-with-colorful-lights-and-perfo.jpg",
        caption: "The stage lit up with vibrant performances",
        alt: "Music concert stage",
      },
      { url: "/classical-musician-playing-sitar-on-stage.jpg", caption: "Classical sitar performance", alt: "Sitar performance" },
      { url: "/student-rock-band-performing-with-guitars-and-drum.jpg", caption: "Energetic rock band performance", alt: "Rock band" },
      { url: "/audience-enjoying-music-concert-with-lights.jpg", caption: "Captivated audience enjoying the show", alt: "Concert audience" },
    ],
    tags: ["Music", "Entertainment", "Culture", "Performance"],
  },
  {
    id: 3,
    eventId: 5,
    eventName: "Inter-University Handball Tournament",
    organizer: "Sports Committee",
    spot: "Handball Ground",
    date: "2025-10-10",
    title: "Thrilling Victory: SUST Dominates Handball Tournament 2025",
    author: "Coach Rahim Khan",
    summary:
      "SUST handball team clinched the championship title in an intense three-day tournament, showcasing exceptional teamwork and athletic prowess.",
    content:
      "The Inter-University Handball Tournament 2025 was a testament to the dedication and skill of our athletes. Over three days, eight university teams competed in a thrilling knockout format. SUST's team demonstrated remarkable coordination, strategic play, and unwavering determination, ultimately securing the championship trophy. The event drew large crowds who witnessed some of the most exciting handball matches in recent years.",
    scheduleFragments: [
      {
        time: "08:00 AM - Day 1",
        activity: "Opening & Group Matches",
        description: "Pool stage with 8 teams divided into 2 groups",
      },
      { time: "03:00 PM - Day 1", activity: "Quarter Finals", description: "Top teams advance to knockout stage" },
      { time: "09:00 AM - Day 2", activity: "Semi Finals", description: "Four teams battle for final spots" },
      { time: "04:00 PM - Day 2", activity: "Training & Strategy Session", description: "Teams prepare for finals" },
      { time: "10:00 AM - Day 3", activity: "Third Place Match", description: "Bronze medal match" },
      {
        time: "03:00 PM - Day 3",
        activity: "Championship Final",
        description: "Gold medal match and trophy presentation",
      },
    ],
    images: [
      {
        url: "/handball-match-action-shot-with-players-competing.jpg",
        caption: "Intense action during the championship match",
        alt: "Handball match",
      },
      { url: "/handball-team-celebrating-victory-with-trophy.jpg", caption: "SUST team celebrating their victory", alt: "Victory celebration" },
      { url: "/handball-tournament-crowd-cheering-in-stadium.jpg", caption: "Enthusiastic crowd support", alt: "Tournament crowd" },
      { url: "/handball-players-receiving-medals-and-trophy-cerem.jpg", caption: "Medal ceremony and team recognition", alt: "Medal ceremony" },
    ],
    tags: ["Sports", "Handball", "Championship", "Athletics"],
  },
  {
    id: 4,
    eventId: 6,
    eventName: "Basketball Championship Finals",
    organizer: "Sports Committee",
    spot: "Basketball Ground",
    date: "2025-09-25",
    title: "Slam Dunk Success: Basketball Championship 2025 Highlights",
    author: "Ahmed Kamal",
    summary:
      "The annual basketball championship delivered edge-of-your-seat excitement with incredible dunks, three-pointers, and outstanding team performances.",
    content:
      "Basketball Championship 2025 brought together the finest players from across the university in a day-long tournament that kept spectators on the edge of their seats. The championship featured fast-paced games, spectacular dunks, precision three-pointers, and defensive plays that showcased the high level of basketball talent at SUST. The final match was particularly memorable, going into overtime with a nail-biting finish.",
    scheduleFragments: [
      {
        time: "08:00 AM",
        activity: "Team Registration & Warm-up",
        description: "Teams check-in and practice sessions",
      },
      { time: "09:30 AM", activity: "Opening Round - Match 1 & 2", description: "Pool A matches" },
      { time: "12:00 PM", activity: "Opening Round - Match 3 & 4", description: "Pool B matches" },
      { time: "02:00 PM", activity: "Lunch Break", description: "Refreshments and team strategy discussions" },
      { time: "03:30 PM", activity: "Semi Finals", description: "Top 4 teams compete for final berths" },
      { time: "06:00 PM", activity: "Championship Final", description: "Title match and trophy presentation" },
    ],
    images: [
      { url: "/basketball-player-making-slam-dunk-during-game.jpg", caption: "Spectacular slam dunk moment", alt: "Basketball slam dunk" },
      { url: "/basketball-championship-match-with-scoreboard.jpg", caption: "Intense championship final game", alt: "Championship match" },
      { url: "/basketball-team-celebrating-with-championship-trop.jpg", caption: "Champions lifting the trophy", alt: "Championship winners" },
      {
        url: "/placeholder.svg?height=400&width=600",
        caption: "Energetic atmosphere at the venue",
        alt: "Tournament atmosphere",
      },
    ],
    tags: ["Sports", "Basketball", "Championship", "Competition"],
  },
  {
    id: 5,
    eventId: 8,
    eventName: "Art Exhibition: Colors of Campus",
    organizer: "Art Club",
    spot: "Central Field",
    date: "2025-08-05",
    title: "A Canvas of Creativity: Art Exhibition 2025 Review",
    author: "Nusrat Jahan",
    summary:
      "The outdoor art exhibition transformed Central Field into a vibrant gallery showcasing diverse artistic expressions from painting to sculpture and digital art.",
    content:
      "Colors of Campus 2025 was a breathtaking celebration of artistic talent that transformed our Central Field into an open-air gallery. Over three days, visitors explored diverse art forms including traditional paintings, contemporary sculptures, photography, and digital installations. The exhibition featured works from over 80 student artists, each piece telling unique stories about campus life, social issues, and personal journeys. The outdoor setting added a magical dimension to the experience, especially during the evening light shows.",
    scheduleFragments: [
      {
        time: "09:00 AM - Day 1",
        activity: "Exhibition Opening",
        description: "Ribbon cutting and artist introductions",
      },
      {
        time: "11:00 AM - All Days",
        activity: "Gallery Walk-through",
        description: "Guided tours explaining artworks",
      },
      {
        time: "02:00 PM - All Days",
        activity: "Live Art Sessions",
        description: "Artists creating works in real-time",
      },
      { time: "04:00 PM - Day 2", activity: "Artist Panel Discussion", description: "Talk on art and society" },
      { time: "06:00 PM - All Days", activity: "Evening Light Show", description: "Digital art projections" },
      { time: "08:00 PM - Day 3", activity: "Closing Ceremony", description: "Award announcement and farewell" },
    ],
    images: [
      {
        url: "/placeholder.svg?height=400&width=600",
        caption: "Visitors exploring the outdoor gallery",
        alt: "Art exhibition",
      },
      {
        url: "/placeholder.svg?height=400&width=600",
        caption: "Contemporary sculpture installation",
        alt: "Sculpture art",
      },
      {
        url: "/placeholder.svg?height=400&width=600",
        caption: "Live art creation demonstration",
        alt: "Live painting",
      },
      {
        url: "/placeholder.svg?height=400&width=600",
        caption: "Evening light show illuminating artworks",
        alt: "Night exhibition",
      },
    ],
    tags: ["Art", "Exhibition", "Culture", "Creativity"],
  },
];