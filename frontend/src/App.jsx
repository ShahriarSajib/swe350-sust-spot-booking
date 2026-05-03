// import Header from "./components/Header/Header";
// import AnimeSection from "./components/sections/AnimeSection";
// import FeaturedEventsSection from "./components/sections/FeaturedEventsSection";
// import PreferredSpotSection from "./components/sections/PreferredSpotSection";
// import UpcomingEventsSection from "./components/sections/UpcomingEventsSection";

// function App() {
//   return (
//     <>
//       <Header />
//       <AnimeSection />
//       <PreferredSpotSection/>
//       <UpcomingEventsSection/>
//       <FeaturedEventsSection/>

//     </>
//   );
// }

// export default App;

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Default route */}
//         <Route path="/" element={<Navigate to="/login" />} />

//         {/* Auth routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Optional: 404 fallback */}
//         <Route path="*" element={<h1>Page Not Found</h1>} />

//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header/Header";
// import AnimeSection from "./components/sections/AnimeSection";
// import FeaturedEventsSection from "./components/sections/FeaturedEventsSection";
// import PreferredSpotSection from "./components/sections/PreferredSpotSection";
// import UpcomingEventsSection from "./components/sections/UpcomingEventsSection";

// import FeaturedEventsBlog from "./pages/FeaturedEventsBlog";
// import BlogDetail from "./pages/BlogDetail";
// // import Login from "./pages/Login";
// // import Register from "./pages/Register";

// import SpotDetail from './pages/SpotDetails';
// import Profile from './pages/ProfilePage';

// function App() {
//   return (
//     <Router>
//       <Header />

//       <Routes>
//         <Route path="/" element={
//           <>
//             <AnimeSection />
//             <PreferredSpotSection />
//             <UpcomingEventsSection />
//             <FeaturedEventsSection />
//           </>
//         } />

//         <Route path="/featured-events" element={<FeaturedEventsBlog />} />
//         <Route path="/blog/:id" element={<BlogDetail />} />
//         <Route path="/central-auditorium" element={<SpotDetail />} />
//         {/* <Route path="/mini-auditorium" element={<SpotDetail />} />
//         <Route path="/central-field" element={<SpotDetail />} />
//         <Route path="/handball-ground" element={<SpotDetail />} />
//         <Route path="/basketball-ground" element={<SpotDetail />} /> */}
//         <Route path="/profile" element={<Profile />} />

//       </Routes>

//     </Router>
//   );
// }

// export default App;

// import SpotDetail from './pages/SpotDetails';

// function App() {
//   return <SpotDetail />;
// }

// export default App;

// import Profile from './pages/ProfilePage';

// function App() {
//   return <Profile />;
// }

//export default App;

// import AdminDashboard from './pages/AdminDashboard';

// function App() {
//   return <AdminDashboard />;
// }

// export default App;

// import { BrowserRouter } from "react-router-dom"; // ১. এটি ইম্পোর্ট করুন
// import AdminDashboard from './pages/AdminDashboard';

// function App() {
//   return (
//     // ২. পুরো ড্যাশবোর্ডকে BrowserRouter দিয়ে র‍্যাপ করে দিন
//     <BrowserRouter>
//       <AdminDashboard />
//     </BrowserRouter>
//   );
// }

// export default App;

// import { BrowserRouter } from "react-router-dom"; // ১. এটি ইম্পোর্ট করুন
// import FieldsAdminDashboard from './pages/FieldsAdminDashboard';

// function App() {
//   return (
//     // ২. পুরো ড্যাশবোর্ডকে BrowserRouter দিয়ে র‍্যাপ করে দিন
//     <BrowserRouter>
//       <FieldsAdminDashboard />
//     </BrowserRouter>
//   );
// }

// export default App;

// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useState } from "react";

// // Components & Sections
// import Header from "./components/Header/Header";
// import AnimeSection from "./components/sections/AnimeSection";
// import PreferredSpotSection from "./components/sections/PreferredSpotSection";
// import UpcomingEventsSection from "./components/sections/UpcomingEventsSection";
// import FeaturedEventsSection from "./components/sections/FeaturedEventsSection";

// // Pages
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import Profile from './pages/ProfilePage';
// import SpotDetail from './pages/SpotDetails';
// import FeaturedEventsBlog from "./pages/FeaturedEventsBlog";
// import BlogDetail from "./pages/BlogDetail";

// function App() {

//   const [showMainSite, setShowMainSite] = useState(false);

//   return (
//     <Router>
//       {showMainSite && <Header />}

//       <Routes>
//         {!showMainSite ? (
//           <>
//             <Route path="*" element={<Login onLogin={() => setShowMainSite(true)} />} />
//             <Route path="/register" element={<Register />} />
//           </>
//         ) : (

//           <>
//             <Route path="/" element={
//               <>
//                 <AnimeSection />
//                 <PreferredSpotSection />
//                 <UpcomingEventsSection />
//                 <FeaturedEventsSection />
//               </>
//             } />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/central-auditorium" element={<SpotDetail />} />
//             <Route path="/featured-events" element={<FeaturedEventsBlog />} />
//             <Route path="/blog/:id" element={<BlogDetail />} />

//             {/* আরও রুট এখানে দিতে পারেন */}
//             <Route path="*" element={<Navigate to="/" />} />
//           </>
//         )}
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { useState } from "react";
import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";

// Components & Sections
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AnimeSection from "./components/sections/AnimeSection";
import FeaturedEventsSection from "./components/sections/FeaturedEventsSection";
import PreferredSpotSection from "./components/sections/PreferredSpotSection";
import UpcomingEventsSection from "./components/sections/UpcomingEventsSection";

// Pages
//import AdminNotifications from "./pages/AdminNotifications";
import ExternalRegister from "./pages/auth/ExternalRegister";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import BlogDetail from "./pages/BlogDetail";
import FeaturedEventsBlog from "./pages/FeaturedEventsBlog";
import Profile from "./pages/ProfilePage";
import SpotDetail from "./pages/SpotDetails";
import UserNotifications from "./pages/UserNotifications"; // Import the user version
import InfoPage from "./pages/InfoPage";
// New: Add your Admin Dashboard component
import FieldsAdminDashboard from "./pages/FieldsAdminDashboard";

import Hello from "./pages/hello";

import ScrollToTop from "./ScrollToTop";

function App() {
  const [authRole, setAuthRole] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-based notification logic
  const isNotifOpen = searchParams.get("showNotif") === "true";

  const openNotif = () => {
    setSearchParams({ showNotif: "true" }, { replace: false });
  };

  const closeNotif = () => {
    //searchParams.delete("showNotif");
    setSearchParams({}, { replace: false });
  };


  return (
    <>
      <ScrollToTop />
      {/* 1. Global Notification Modals */}
      {isNotifOpen && authRole === "user" && (
        <UserNotifications isOpen={true} onClose={closeNotif} />
      )}

      {/* {isNotifOpen && authRole === "admin" && (
        <AdminNotifications isOpen={true} onClose={closeNotif} />
      )} */}

      {/* 2. Header (passing the new openNotif function) */}
      {authRole === "user" && (
        <Header
          role={authRole}
          onLogout={() => {
            localStorage.clear();
            setAuthRole(null);
          }}
          onOpenNotif={openNotif}
        />
      )}

      {/* 3. Routing Logic */}
      <Routes>
        <Route path="/info/:type" element={<InfoPage />} />
        <Route path="/hello" element={<Hello />} />
        {!authRole ? (
          <>
            <Route
              path="/login"
              element={<Login onLogin={(role) => setAuthRole(role)} />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/external-booking" element={<ExternalRegister />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : authRole === "admin" ? (
          <>
            <Route path="/admin-dashboard" element={<FieldsAdminDashboard />} />
            <Route path="*" element={<Navigate to="/admin-dashboard" />} />
          </>
        ) : (
          <>
            <Route
              path="/"
              element={
                <>
                  <AnimeSection />
                  
                    <PreferredSpotSection />
                  
                  <UpcomingEventsSection />
                  <FeaturedEventsSection />
                </>
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/spot/:id" element={<SpotDetail />} />
            <Route path="/featured-events" element={<FeaturedEventsBlog />} />
            <Route path="/preferred-spots" element={<PreferredSpotSection />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="*" element={<Navigate to="/" />} />

          </>
        )}
      </Routes>
      {authRole === "user" && <Footer />}
    </>
  );
}

export default App;
