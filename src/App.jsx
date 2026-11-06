import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { MatterProvider } from "./context/MatterContext";
import { ToastProvider } from "./components/ui/Toast";

// Public pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// App pages
import Dashboard from "./pages/Dashboard";
import Matters from "./pages/Matters";
import AIInvestigation from "./pages/AIInvestigation";
import LegalResearch from "./pages/LegalResearch";
import DocumentLibrary from "./pages/DocumentLibrary";
import UploadEvidence from "./pages/UploadEvidence";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import Timeline from "./pages/Timeline";
import Findings from "./pages/Findings";
import FindingDetail from "./pages/FindingDetail";
import EvidenceComparison from "./pages/EvidenceComparison";
import Conversations from "./pages/Conversations";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Legacy page stubs (will be redirected)
import DocumentViewer from "./pages/DocumentViewer";

function AppPage({ children }) {
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}

function App() {
  return (
    <ToastProvider>
      <MatterProvider>
        <BrowserRouter>
          <Routes>

            {/* ── PUBLIC ── */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

           {/* ── PROTECTED APP ── */}
<Route element={<ProtectedRoute />}>

  {/* Redirect bare /app → dashboard */}
  <Route
    path="/app"
    element={<Navigate to="/app/dashboard" replace />}
  />

  <Route
    path="/app/dashboard"
    element={
      <AppPage>
        <Dashboard />
      </AppPage>
    }
  />

  <Route
    path="/app/matters"
    element={
      <AppPage>
        <Matters />
      </AppPage>
    }
  />

  <Route
    path="/app/investigation"
    element={
      <AppPage>
        <AIInvestigation />
      </AppPage>
    }
  />

  <Route
    path="/app/research"
    element={
      <AppPage>
        <LegalResearch />
      </AppPage>
    }
  />

  <Route
    path="/app/documents"
    element={
      <AppPage>
        <DocumentLibrary />
      </AppPage>
    }
  />

  <Route
    path="/app/upload"
    element={
      <AppPage>
        <UploadEvidence />
      </AppPage>
    }
  />

  <Route
    path="/app/analysis"
    element={
      <AppPage>
        <DocumentAnalysis />
      </AppPage>
    }
  />

  <Route
    path="/app/timeline"
    element={
      <AppPage>
        <Timeline />
      </AppPage>
    }
  />

  <Route
    path="/app/findings"
    element={
      <AppPage>
        <Findings />
      </AppPage>
    }
  />

  <Route
    path="/app/findings/:id"
    element={
      <AppPage>
        <FindingDetail />
      </AppPage>
    }
  />

  <Route
    path="/app/findings/:id/compare"
    element={
      <AppPage>
        <EvidenceComparison />
      </AppPage>
    }
  />

  <Route
    path="/app/conversations"
    element={
      <AppPage>
        <Conversations />
      </AppPage>
    }
  />

  <Route
    path="/app/reports"
    element={
      <AppPage>
        <Reports />
      </AppPage>
    }
  />

  <Route
    path="/app/documents/:docId"
    element={
      <AppPage>
        <DocumentViewer />
      </AppPage>
    }
  />

  <Route
    path="/app/profile"
    element={
      <AppPage>
        <Profile />
      </AppPage>
    }
  />

  <Route
    path="/app/settings"
    element={
      <AppPage>
        <Settings />
      </AppPage>
    }
  />

  {/* Legacy paths → redirect */}
  <Route
    path="/dashboard"
    element={<Navigate to="/app/dashboard" replace />}
  />

  <Route
    path="/documents"
    element={<Navigate to="/app/documents" replace />}
  />

  <Route
    path="/documents/viewer"
    element={<Navigate to="/app/documents/DOC-001" replace />}
  />

  <Route
    path="/ai-assistant"
    element={<Navigate to="/app/investigation" replace />}
  />

  <Route
    path="/documents/upload"
    element={<Navigate to="/app/upload" replace />}
  />

  <Route
    path="/documents/analysis"
    element={<Navigate to="/app/analysis" replace />}
  />

  <Route
    path="/case-analysis"
    element={<Navigate to="/app/findings" replace />}
  />

  <Route
    path="/contract-review"
    element={<Navigate to="/app/findings" replace />}
  />

  <Route
    path="/judgment-analysis"
    element={<Navigate to="/app/findings" replace />}
  />

  <Route
    path="/multi-document-analysis"
    element={<Navigate to="/app/timeline" replace />}
  />

  <Route
    path="/conversation-history"
    element={<Navigate to="/app/conversations" replace />}
  />

  <Route
    path="/reports"
    element={<Navigate to="/app/reports" replace />}
  />

  <Route
    path="/profile"
    element={<Navigate to="/app/profile" replace />}
  />

  <Route
    path="/settings"
    element={<Navigate to="/app/settings" replace />}
  />

  <Route
    path="/legal-research"
    element={<Navigate to="/app/research" replace />}
  />

  {/* Unknown protected routes */}
  <Route
    path="*"
    element={<Navigate to="/app/dashboard" replace />}
  />

</Route>

          </Routes>
        </BrowserRouter>
      </MatterProvider>
    </ToastProvider>
  );
}

export default App;
