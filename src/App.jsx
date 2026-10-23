import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import LegalResearch from "./pages/LegalResearch";
import DocumentLibrary from "./pages/DocumentLibrary";
import UploadDocument from "./pages/UploadDocument";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import ConversationHistory from "./pages/ConversationHistory";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import ContractReview from "./pages/ContractReview";
import CaseAnalysis from "./pages/CaseAnalysis";
import JudgmentAnalysis from "./pages/JudgmentAnalysis";
import MultiDocumentAnalysis from "./pages/MultiDocumentAnalysis";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC PAGES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED WORKSPACE */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <AppShell>
                <Dashboard />
              </AppShell>
            }
          />

          <Route
            path="/ai-assistant"
            element={
              <AppShell>
                <AIAssistant />
              </AppShell>
            }
          />

          <Route
            path="/legal-research"
            element={
              <AppShell>
                <LegalResearch />
              </AppShell>
            }
          />

          <Route
            path="/documents"
            element={
              <AppShell>
                <DocumentLibrary />
              </AppShell>
            }
          />

          <Route
            path="/documents/upload"
            element={
              <AppShell>
                <UploadDocument />
              </AppShell>
            }
          />

          <Route
            path="/documents/analysis"
            element={
              <AppShell>
                <DocumentAnalysis />
              </AppShell>
            }
          />

          <Route
            path="/conversation-history"
            element={
              <AppShell>
                <ConversationHistory />
              </AppShell>
            }
          />

          <Route
            path="/reports"
            element={
              <AppShell>
                <Reports />
              </AppShell>
            }
          />

          <Route
            path="/profile"
            element={
              <AppShell>
                <Profile />
              </AppShell>
            }
          />

          <Route
            path="/settings"
            element={
              <AppShell>
                <Settings />
              </AppShell>
            }
          />

          <Route
            path="/contract-review"
            element={
              <AppShell>
                <ContractReview />
              </AppShell>
            }
          />

          <Route
            path="/case-analysis"
            element={
              <AppShell>
                <CaseAnalysis />
              </AppShell>
            }
          />

          <Route
            path="/judgment-analysis"
            element={
              <AppShell>
                <JudgmentAnalysis />
              </AppShell>
            }
          />

          <Route
            path="/multi-document-analysis"
            element={
              <AppShell>
                <MultiDocumentAnalysis />
              </AppShell>
            }
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;