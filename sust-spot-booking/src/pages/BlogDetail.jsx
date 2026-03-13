import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import innovation from "../assets/innovation.png";
import musicConcert from "../assets/consert.png";
import handballMatch from "../assets/handball.png";
import basketballDunk from "../assets/basketball.png";  
import artExhibition from "../assets/art_exibition.png";
import cseCarnival from "../assets/sust-cse-carnival.png";
import carnival1 from "../assets/carnival1.png";
import carnival2 from "../assets/carnival2.png";
import carnival3 from "../assets/carnival3.png";


import innovation1 from "../assets/innovation1.png";
import innovation2 from "../assets/innovation2.png";
import innovation3 from "../assets/innovation3.png";
import innovation4 from "../assets/innovation4.png";

const blogPosts = [
  {
    id: 1,
    eventId: 1,
    eventName: "Annual Science Fair 2025",
    organizer: "Science Club",
    spot: "Central Auditorium",
    date: "2025-12-15",
    title: "A Spectacular Journey Through Innovation at Science Fair 2025",
    author: "Dr. Sarah Ahmed",
    summary: "The Annual Science Fair 2025 showcased groundbreaking projects from students across all departments, featuring AI innovations, sustainable energy solutions, and biotechnology breakthroughs.",
    content: "The Annual Science Fair 2025 was a remarkable celebration of scientific excellence and innovation. Over 150 projects were presented by talented students from various departments, demonstrating the cutting-edge research and creative problem-solving skills developed at SUST. The event attracted over 2,000 visitors including industry professionals, academics, and science enthusiasts.",
    scheduleFragments: [
      { time: "09:00 AM", activity: "Opening Ceremony", description: "Welcome speech by Vice Chancellor and keynote from Nobel Laureate Dr. Rahman" },
      { time: "10:30 AM", activity: "Project Presentations - Session 1", description: "AI & Machine Learning innovations" },
      { time: "01:00 PM", activity: "Lunch Break & Networking", description: "Interaction with industry experts" },
      { time: "02:30 PM", activity: "Project Presentations - Session 2", description: "Sustainable Energy & Biotechnology" },
      { time: "05:00 PM", activity: "Award Ceremony", description: "Recognition of outstanding projects" }
    ],
    images: [
      { url: innovation, caption: "", alt: "" },
      { url: innovation1, caption: "Opening ceremony with distinguished guests", alt: "Science Fair opening ceremony" },
      { url: innovation2, caption: "AI robotics project demonstration", alt: "AI project presentation" },
      { url: innovation3, caption: "Award-winning solar energy project", alt: "Solar energy project" },
      { url: innovation4, caption: "Students engaging with visitors", alt: "Student interaction" }
    ],
    tags: ["Science", "Innovation", "Research", "Technology"]
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
    summary: "An enchanting evening of musical performances featuring classical, contemporary, and fusion genres that brought together music lovers from across the university.",
    content: "Music Night Harmony 2025 was an unforgettable evening that transformed the Mini Auditorium into a mesmerizing concert hall. The event featured performances by both student bands and solo artists, covering diverse musical genres from classical ragas to modern rock.",
    scheduleFragments: [
      { time: "07:00 PM", activity: "Welcome & Introduction", description: "Opening remarks by Music Club President" },
      { time: "08:30 PM", activity: "Contemporary & Rock Sets", description: "Student band performances" },
      { time: "10:30 PM", activity: "Closing Performance", description: "Grand finale with all performers" }
    ],
    images: [
      { url: musicConcert, caption: "The stage lit up with vibrant performances", alt: "Music concert stage" },
      { url: "/classical-musician-playing-sitar-on-stage.jpg", caption: "Classical sitar performance", alt: "Sitar performance" },
      { url: "/student-rock-band-performing-with-guitars-and-drum.jpg", caption: "Energetic rock band performance", alt: "Rock band" }
    ],
    tags: ["Music", "Entertainment", "Culture", "Performance"]
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
    summary: "SUST handball team clinched the championship title in an intense three-day tournament, showcasing exceptional teamwork and athletic prowess.",
    content: "The Inter-University Handball Tournament 2025 was a testament to the dedication and skill of our athletes. SUST's team demonstrated remarkable coordination, strategic play, and unwavering determination.",
    scheduleFragments: [
      { time: "08:00 AM - Day 1", activity: "Opening & Group Matches", description: "Pool stage with 8 teams" },
      { time: "03:00 PM - Day 3", activity: "Championship Final", description: "Gold medal match and trophy presentation" }
    ],
    images: [
      { url: handballMatch, caption: "Intense action during the championship match", alt: "Handball match" },
      { url: "/handball-team-celebrating-victory-with-trophy.jpg", caption: "SUST team celebrating their victory", alt: "Victory celebration" }
    ],
    tags: ["Sports", "Handball", "Championship", "Athletics"]
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
    summary: "The annual basketball championship delivered edge-of-your-seat excitement with incredible dunks and three-pointers.",
    content: "Basketball Championship 2025 brought together the finest players from across the university in a day-long tournament that kept spectators on the edge of their seats.",
    scheduleFragments: [
      { time: "09:30 AM", activity: "Opening Round", description: "Pool A matches" },
      { time: "06:00 PM", activity: "Championship Final", description: "Title match and trophy presentation" }
    ],
    images: [
      { url: basketballDunk, caption: "Spectacular slam dunk moment", alt: "Basketball slam dunk" },
      { url: "/basketball-championship-match-with-scoreboard.jpg", caption: "Intense championship final game", alt: "Championship match" }
    ],
    tags: ["Sports", "Basketball", "Championship", "Competition"]
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
    summary: "The outdoor art exhibition transformed Central Field into a vibrant gallery showcasing diverse artistic expressions.",
    content: "Colors of Campus 2025 was a breathtaking celebration of artistic talent that transformed our Central Field into an open-air gallery.",
    scheduleFragments: [
      { time: "09:00 AM - Day 1", activity: "Exhibition Opening", description: "Ribbon cutting and artist introductions" },
      { time: "06:00 PM - All Days", activity: "Evening Light Show", description: "Digital art projections" }
    ],
    images: [
      { url: artExhibition, caption: "Visitors exploring the outdoor gallery", alt: "Art exhibition" },
      { url: artExhibition, caption: "Contemporary sculpture installation", alt: "Sculpture art" }
    ],
    tags: ["Art", "Exhibition", "Culture", "Creativity"]
  },
  {
    id: 6,
    eventId: 9,
    eventName: "CSE Carnival 2024",
    organizer: "CSE Society",
    spot: "Central Auditorium",
    date: "2024-08-05",
    title: "CSE Carnival 2024  Prize Giving Ceremony ",
    author: "Nusrat Jahan",
    summary: "The CSE Carnival 2024 Prize Giving Ceremony was the grand finale of a week-long celebration of technology and innovation. Held at the Central Auditorium, the event honored the brilliant minds behind groundbreaking projects, competitive programming triumphs, and creative hackathon solutions that defined this year's carnival.",
    content: "The CSE Carnival 2024 Prize Giving Ceremony was a breathtaking celebration of talent, logic, and creativity. The Central Auditorium was filled with an electric atmosphere as students, faculty, and industry experts gathered to recognize the outstanding achievements of the participants.From the intense coding battles in the competitive programming segments to the visionary prototypes showcased in the hackathons, the carnival served as a melting pot of innovation. The ceremony didn't just award trophies; it celebrated the countless hours of hard work, late-night debugging, and the spirit of collaboration within the CSE community.The event featured inspiring speeches from the chief guests, followed by a digital showcase of the winning projects. As the winners took to the stage, the auditorium resonated with applause, marking the success of another monumental chapter in SUST's technological journey. It was more than just a prize-giving; it was a testament to the future of technology being built right here on campus.",
    scheduleFragments: [
    { 
        time: "09:30 AM", 
        activity: "Check-in & Kit Distribution", 
        description: "Participants receive their ID cards, t-shirts, and carnival kits at the registration booth." 
    },
    { 
        time: "10:30 AM", 
        activity: "Opening Keynote", 
        description: "Inauguration speech by the Head of the Department and special guest introduction." 
    },
    { 
        time: "11:30 AM - 01:30 PM", 
        activity: "Hackathon Phase 1", 
        description: "The coding begins! Teams start building their prototypes under the mentorship of industry experts." 
    },
    { 
        time: "02:30 PM", 
        activity: "Tech Talk: Future of AI", 
        description: "A seminar on Generative AI and its impact on the software industry." 
    },
    { 
        time: "04:30 PM", 
        activity: "Prize Giving Ceremony", 
        description: "Announcement of winners and distribution of trophies and certificates in the Central Auditorium." 
    }
],
    images: [
      { url: cseCarnival, caption: "Opening Ceremony ", alt: "Art exhibition" },
      { url: cseCarnival, caption: "Opening Ceremony ", alt: "Art exhibition" },
      { url: carnival1, caption: "Prize giving to winner of competitive Progaming ", alt: "Sculpture art" },
      { url: carnival2, caption: "Hackathon Winner Prize Giving ", alt: "Sculpture art" },
      { url: carnival3, caption: "Group Photo of Winners and Organizers ", alt: "Sculpture art" }

    ],
    tags: ["Coding", "Creativity", "Hackathon",]
  }
  
];

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  

  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Blog Post Not Found</h2>
        <button 
          onClick={() => navigate('/featured-events-blog')} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition-colors"
        >
          Return to Blog List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* STICKY HEADER */}
      {/* <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 py-4 px-6 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-900 font-bold text-sm uppercase tracking-widest hover:text-blue-600 transition-colors"
        >
          ← Back to Blogs
        </button>
        <div className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Reading: {post.eventName}
        </div>
      </header> */}

      <article className="max-w-4xl mx-auto py-12 px-6">
        {/* HERO IMAGE */}
        <div className="w-full h-[300px] md:h-[500px] rounded-[40px] overflow-hidden mb-12 shadow-2xl bg-slate-100 border border-slate-200">
          <img
            src={post.images[0].url}
            className="w-full h-full object-cover"
            alt={post.title}
          />
        </div>

        {/* HEADER SECTION */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em]">
            {post.spot}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="text-slate-300">AUTHOR:</span> {post.author}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">DATE:</span> {post.date}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">ORG:</span> {post.organizer}
            </div>
          </div>
        </div>

        {/* SUMMARY SECTION */}
        <div className="bg-slate-50 p-8 rounded-3xl border-l-8 border-blue-500 mb-12 italic text-slate-700 leading-relaxed font-medium text-lg shadow-sm border border-slate-200">
          "{post.summary}"
        </div>

        {/* MAIN CONTENT */}
        <div className="text-slate-600 text-lg leading-loose mb-16 whitespace-pre-line border-b border-slate-100 pb-12">
          {post.content}
        </div>

        {/* SCHEDULE SECTION (এখানেই ডিপ অ্যাশ কালার ব্যবহার করা হয়েছে) */}
        <section className="mb-20">
          <h2 className="text-2xl font-black text-slate-900 uppercase mb-8 flex items-center gap-3">
            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm shadow-lg shadow-blue-200">
              S
            </span>
            Event Highlights
          </h2>
          <div className="grid gap-6">
            {post.scheduleFragments.map((frag, idx) => (
              <div
                key={idx}
                className="bg-slate-100 border border-slate-200 p-6 rounded-3xl flex flex-col md:flex-row gap-6 hover:bg-slate-200 transition-all duration-300 hover:shadow-md"
              >
                <div className="min-w-[120px] text-blue-600 font-black text-sm md:border-r md:border-slate-300 md:pr-4">
                  {frag.time}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">
                    {frag.activity}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {frag.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section className="pb-20">
          <h2 className="text-2xl font-black text-slate-900 uppercase mb-8">
            Event Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {post.images.slice(1).map((img, idx) => (
              <div key={idx} className="group">
                <div className="h-72 rounded-[32px] overflow-hidden shadow-lg mb-4 bg-slate-100 border border-slate-200">
                  <img
                    src={img.url}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={img.alt}
                  />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  {img.caption}
                </p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
};

export default BlogDetail;