import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.js";
import SignUp from "./pages/signup.js";
import Home from "./pages/home.js";
import LatestEvents from "./pages/latestEvents.js";
import Login from "./pages/login.js";
import Profile from "./pages/profile.js";
import Stories from "./pages/Stories.js";
import StoryDetail from "./pages/StoryDetail.js";
import EventRegister from './pages/EventRegister';

// import UserRoutes from "./components/UserRoutes.js";
import AdminDashboard from "./pages/AdminDashboard.js";
// import AdminRoutes from "./components/AdminRoutes.js";
import CalendarPage from "./pages/CalendarPage.js";
import AdminStats from "./pages/AdminStats.js";
import AdminLayout from "./components/AdminLayout.js";
import ManageEvents from "./pages/ManageEvents.js";
import EventDetails from "./pages/EventDetails.js";
import ManageUsers from "./pages/ManageUser.js";

import UserLayout from './components/UserLayout';

// import EditProfile from './pages/user/EditProfile';
import UserAddEvent from './pages/UserAddEvent';
import MyEvents from './pages/MyEvents';


import UploadVideoForm from "./pages/UploadVideoForm.js";
import VideoGallery from "./pages/VideoGallery.js";

import UploadStoryForm from "./pages/UploadStoryForm.js";

import ApproveEvents from './pages/ApproveEvents.js';

import UploadAdvertisementForm from './pages/UploadAdvertisementForm.js';



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<div><Home/></div>} />
        <Route path="/districts" element={<div>Districts</div>} />
        <Route path="/events" element={<div><LatestEvents/></div>} />
        <Route path="/stories" element={<div><Stories/></div>} />
        <Route path="/videos" element={<div><VideoGallery/></div>} />
        <Route path="/calendar" element={<div><CalendarPage /></div>} />
        <Route path="/categories" element={<div>Categories</div>} />
        <Route path="/signup" element={<div><SignUp /></div>} />
        <Route path="/login" element={<div><Login /></div>} />
        {/* // <Route path="/profile" element={<UserRoutes><Profile /></UserRoutes>}/> */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminStats />} />
          <Route path="add-event" element={<AdminDashboard />} />
          <Route path="approve-events" element={<ApproveEvents />} />
          <Route path="manage-events" element={<ManageEvents />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="upload-video" element={<UploadVideoForm />} />
          <Route path="add-story" element={<UploadStoryForm />} />
          <Route path ="add-advertisement" element={<UploadAdvertisementForm />} />
        </Route>
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/event/:id/register" element={<EventRegister />} />
        <Route path="/stories/:id" element={<StoryDetail />} />
        {/* User Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="profile" element={<Profile />} />
            <Route path="add-event" element={<UserAddEvent />} />
            <Route path="my-events" element={<MyEvents />} />
          </Route>
      </Routes>
    </Router>
  );
}

export default App;
