import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import { ConfigProvider } from "./context/ConfigContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";

import NotificationContainer from "./components/Notifications/NotificationContainer";

import "./index.css";
import "./styles/theme.css";
import "./styles/layout.css";

import Home from './pages/HomePage.jsx';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Admin from './components/Admin/Admin';
import Statistics from './components/Admin/Statistics';
import Notifications from './components/Admin/Notifications.jsx';
import Users from './components/Admin/Users.jsx';
import Scoreboard from "./components/Admin/Scoreboard.jsx";
import Challenges from "./components/Admin/Challenges.jsx";
import CreateChallenge from "./components/Admin/CreateChallenge.jsx";
import Submissions from "./components/Admin/Submissions.jsx";
import Config from "./components/Admin/Config.jsx";

import ChallengesPage from "./pages/ChallengesPage.jsx";
import PlayerLayout from "./layout/PlayerLayout.jsx";
import ScoreboardPage from "./pages/ScoreboardPage.jsx";
import TeamsPage from "./pages/TeamsPage.jsx";
import RulesPage from "./pages/RulesPage.jsx";

import EditChallenge from "./components/Admin/EditChallenges.jsx";
import BuilderPage from "./builder/BuilderPage.jsx";
import ThemeSettings from "./pages/ThemeSettings.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx"

import NotificationListener from "./components/Notifications/NotificationListener";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <NotificationProvider> {/* ✅ ADD THIS */}
                    <ConfigProvider>

                        <NotificationContainer /> {/* ✅ ADD THIS */}
                        <NotificationListener />

                        <Routes>

                            {/* PLAYER ROUTES */}
                            <Route
                                index
                                element={
                                    <PlayerLayout>
                                        <Home />
                                    </PlayerLayout>
                                }
                            />

                            <Route
                                path="/challenges"
                                element={
                                    <PlayerLayout>
                                        <ChallengesPage />
                                    </PlayerLayout>
                                }
                            />

                            <Route
                                path="/scoreboard"
                                element={
                                    <PlayerLayout>
                                        <ScoreboardPage />
                                    </PlayerLayout>
                                }
                            />

                            <Route
                                path="/rules"
                                element={
                                    <PlayerLayout>
                                        <RulesPage />
                                    </PlayerLayout>
                                }
                            />

                            <Route
                                path="/teams"
                                element={
                                    <PlayerLayout>
                                        <TeamsPage />
                                    </PlayerLayout>
                                }
                            />

                            {/* ✅ FIXED ROUTE */}
                            <Route
                                path="/notifications"
                                element={
                                    <PlayerLayout>
                                        <NotificationsPage />
                                    </PlayerLayout>
                                }
                            />

                            {/* BUILDER */}
                            <Route path="/builder" element={<BuilderPage />} />

                            {/* THEME */}
                            <Route path="/themesettings" element={<ThemeSettings />} />

                            {/* AUTH */}
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />

                            {/* ADMIN */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute>
                                        <Admin />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<Navigate to="statistics" />} />
                                <Route path="statistics" element={<Statistics />} />
                                <Route path="notifications" element={<Notifications />} />
                                <Route path="users" element={<Users />} />
                                <Route path="scoreboard" element={<Scoreboard />} />
                                <Route path="challenges" element={<Challenges />} />
                                <Route path="challenges/create" element={<CreateChallenge />} />
                                <Route path="challenges/edit/:id" element={<EditChallenge />} />
                                <Route path="submissions" element={<Submissions />} />
                                <Route path="config" element={<Config />} />
                            </Route>

                        </Routes>

                    </ConfigProvider>
                </NotificationProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}