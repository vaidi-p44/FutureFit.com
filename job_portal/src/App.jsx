import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/navbar/navbar";
import Home from "./components/home";
import Findjobs from "./components/Find Jobs/Findjobs";
import About from "./components/About us/About";
import FindTalent from "./employeecomponents/FindTalent/FindTalent";
import EducationForm from "./components/Education/EducationForm";
import EmployeeDashboard from "./employeecomponents/EmployeeDashboard/EmployeeDashboard";
import AdminDashboard from "../../admin/src/App";
import ProfileSection from "./components/ProfileSection/ProfileSection";
import AccountManagement from "./components/AccountManagement/AccountManagement";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import EmployeeRegistration from "./employeecomponents/EmployeeRegistration/EmployeeRegistration";
import Employeenavbar from "./employeecomponents/Employeenavbar/Employeenavbar";
import JobsPage from "./Employeepages/JobsPage";
import ResdexPage from "./Employeepages/ResdexPage";
import AnalyticsPage from "./Employeepages/AnalyticsPage";
import SettingsPage from "./Employeepages/SettingsPage";
import Settings from "./components/settings/settings";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";
import Aboutyou from "./components/About_you/Aboutyou";
import CareerPreferences from "./components/CareerPreferences/CareerPreferences";
import PostJob from "./employeecomponents/Post Jobs/PostJob";
import CompanyProfile from "./employeecomponents/CompanyProfile/CompanyProfile";
import Help from "./employeecomponents/Help/Help";
import ChangePassword from "./employeecomponents/ChangePassword/ChangePassword";
import Feedback from "./employeecomponents/Feedback/Feedback";
import Feedbackforemp from "./employeecomponents/Feedback/Feedback";
import ManageUsers from "./employeecomponents/ManageUsers/ManageUsers";
import ProductSettings from "./employeecomponents/ProductSettings/ProductSettings";
import Setting from "./employeecomponents/Settings/Settings";
import Subscriptions from "./employeecomponents/Subscriptions/Subscriptions";
import Otp from "./components/Otp/otp";
import CandidateProfile from "./Employeepages/candidate-profile";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import FindTalentPage from "./Employeepages/FindTalentPage";
import Admin from "../../admin/src/App";
import Profile from "./employeecomponents/Profile/Profile";
import AppliedJobs from "./components/AppliedJobs/AppliedJobs";
// Layout wrapper for job seeker pages (with Navbar)
function JobSeekerLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

// Layout wrapper for employee pages (without Navbar)
function EmployeeLayout() {
  return (
    <>
      <Employeenavbar />
      <Outlet />;
    </>
  );
}

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <AppWithRouter />
    </BrowserRouter>
  );
}

function AppWithRouter() {
  const location = useLocation();

  return (
    <Routes>
      {/* Admin Route */}
      <Route path="/Admin" element={<Admin />} />

      {/* Job Seeker Routes */}
      <Route element={<JobSeekerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/find-jobs" element={<Findjobs />} />
        <Route path="/about" element={<About />} />
        <Route path="/Aboutyou" element={<Aboutyou />} />
        <Route path="/find-talent" element={<FindTalent />} />
        <Route path="/registration-form" element={<RegistrationForm />} />
        <Route path="/ProfileSection" element={<ProfileSection />} />
        <Route path="/EducationForm" element={<EducationForm />} />
        <Route path="/AccountManagement" element={<AccountManagement />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/VerifyEmail" element={<VerifyEmail />} />
        <Route path="/CareerPreferences" element={<CareerPreferences />} />
        <Route path="/Otp" element={<Otp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Feedback" element={<Feedback />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/AppliedJobs" element={<AppliedJobs />} />
      </Route>

      {/* Employee Routes */}
      <Route element={<EmployeeLayout />}>
        <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
        <Route
          path="/EmployeeRegistration"
          element={<EmployeeRegistration />}
        />
        <Route path="/jobs/*" element={<JobsPage />} />
        <Route path="/CompanyProfile" element={<CompanyProfile />} />
        <Route path="/post-jobs" element={<PostJob />} />
        <Route path="/resdex/*" element={<ResdexPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/FindTalentPage" element={<FindTalentPage />} />
        <Route path="/settings/*" element={<SettingsPage />} />
        <Route path="/Subscriptions" element={<Subscriptions />} />
        <Route path="/Setting" element={<Setting />} />
        <Route path="/ProductSettings" element={<ProductSettings />} />
        <Route path="/ManageUsers" element={<ManageUsers />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route path="/CandidateProfile" element={<CandidateProfile />} />
        <Route path="/Help" element={<Help />} />
        <Route path="/Feedbackforemp" element={<Feedbackforemp />} />
        <Route path="/Profile" element={<Profile />} />
      </Route>

      {/* Shared Routes for Both Job Seekers and Employees */}
      <Route path="/Feedback" element={<Feedback />} />

      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;

// import "bootstrap/dist/css/bootstrap.min.css";
// import Navbar from "./components/navbar/navbar";
// import Fonts from "./components/Homepage/Homepage";
// import Login from "./components/login/login";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
//   Outlet,
// } from "react-router-dom";
// import Home from "./components/home";
// import Register from "./components/register/Register";
// import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
// import Findjobs from "./components/Find Jobs/Findjobs";
// import PostJob from "./components/Post Jobs/PostJob";
// import About from "./components/About us/About";
// import FindTalent from "./components/FindTalent/FindTalent";
// import ProfileSection from "./components/ProfileSection/ProfileSection";
// import EmployeeDashboard from "./components/EmployeeDashboard/EmployeeDashboard";
// import Aboutyou from "./components/About_you/Aboutyou";
// import EducationForm from "./components/Education/EducationForm";
// import AdminDashboard from "../../admin/src/App";
// import EmployeeRegistration from "./components/EmployeeRegistration/EmployeeRegistration";
// function App() {
//   return (
//     <BrowserRouter>
//       <AppWithRouter />
//     </BrowserRouter>
//   );
// }
// function AppWithRouter() {
//   const location = useLocation(); // Get current location (pathname)

//   // Define routes where Navbar should not be shown
//   // const hideNavbarRoutes = ["/RegistrationForm"]; // Add any routes where you don't want Navbar to appear
//   // const hideFontsRoutes = ["/RegistrationForm"];
//   return (
//     <div>
//       {/* Conditionally render Navbar based on the current path */}
//       {/* {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
//       {!hideFontsRoutes.includes(location.pathname) && <Fonts />} */}
//       <Navbar />
//       <Routes>
//         <Route
//           path="/EmployeeRegistration"
//           element={<EmployeeRegistration />}
//         />
//         <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
//         <Route path="/admin-dashboard" element={<AdminDashboard />} />
//         <Route path="/find-jobs" element={<Findjobs />} />
//         <Route path="/post-jobs" element={<PostJob />} />
//         <Route path="/About" element={<About />} />
//         <Route path="/Find-talent" element={<FindTalent />} />
//         <Route path="/" element={<Home />} />
//         <Route path="/Aboutyou" element={<Aboutyou />} />
//         <Route path="EducationForm" element={<EducationForm />} />
//         <Route path="/RegistrationForm" element={<RegistrationForm />} />
//         <Route path="ProfileSection" element={<ProfileSection />} />
//         {/* <Route path="/home" element={<Navigate to="/" />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/RegistrationForm" element={<RegistrationForm />} />{" "}

//         <Route path="/RegistrationForm" element={<RegistrationForm />} />{" "}
//         */}
//       </Routes>
//     </div>
//   );
// }

// export default App;
