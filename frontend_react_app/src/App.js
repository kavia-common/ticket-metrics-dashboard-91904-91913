import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import UploadArea from './components/UploadArea';
import MetricsSummary from './components/MetricsSummary';
import ChartPanel from './components/ChartPanel';

// PUBLIC_INTERFACE
function App() {
  /**
   * This is the main application component for the Ticket Metrics Dashboard.
   * It manages:
   * - Theme state (light/dark) and applies it via [data-theme] for CSS variables.
   * - Uploaded file state from the UploadArea component.
   * - Filter state for Application and Month selection.
   * - Minimal mocked metrics derived from basic state (no real Excel parsing yet).
   */
  const [theme, setTheme] = useState('light');
  const [uploadedFile, setUploadedFile] = useState(null);

  // New filter state: Application and Month (compact format)
  const [selectedApplication, setSelectedApplication] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  // Options
  const applicationOptions = useMemo(() => {
    // Deduplicated application list with placeholder "Application" first
    return [
      'Application', 'App Dynamics', 'DataDog', 'Mele', 'MetriX', 'Octane',
      'Watchmen', 'Elements', 'Logging', 'Splunk', 'Loadrunner', 'CNAP'
    ];
  }, []);

  const monthOptions = useMemo(() => {
    // Compact format with disabled placeholder "Month"
    return ['Month', 'Apr-25', 'May-25', 'Jun-25', 'Jul-25'];
  }, []);

  // Apply theme to document element for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Mocked metrics derived from whether a file is present.
  // Real parsing will populate meaningful values later.
  const metrics = useMemo(() => {
    if (!uploadedFile) {
      return { total: 0, resolved: 0, pending: 0 };
    }
    // Mock values when a file is present
    return { total: 120, resolved: 75, pending: 45 };
  }, [uploadedFile]);

  // Handlers for selects (controlled)
  const handleApplicationChange = (e) => {
    const val = e.target.value;
    setSelectedApplication(val === 'Application' ? '' : val);
  };

  const handleMonthChange = (e) => {
    const val = e.target.value;
    setSelectedMonth(val === 'Month' ? '' : val);
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="brand">
            <div className="brand-logo" aria-hidden="true">🧭</div>
            <div className="brand-text">
              <div className="brand-title">Ticket Metrics Dashboard</div>
              <div className="brand-subtitle">Ocean Professional</div>
            </div>
          </div>
        </div>
        <div className="navbar-right">
          <span className="theme-badge" aria-label={`Current theme: ${theme}`}>
            {theme === 'light' ? 'Light' : 'Dark'}
          </span>
          <button
            className="btn theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>

      {/* Page Header - subtle gradient and intro */}
      <header className="page-hero">
        <div className="page-hero-inner">
          <h1 className="page-title">Insights at a glance</h1>
          <p className="page-subtitle">
            Upload an Excel file (.xlsx or .xls) to view ticket metrics and visualize trends.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="content">
        <section className="content-grid">
          <div className="panel upload-panel">
            <h2 className="panel-title">Upload Data</h2>
            <p className="panel-description">
              Select your Excel file to begin. We support .xlsx and .xls formats.
            </p>
            <UploadArea onFileSelected={setUploadedFile} />
            {uploadedFile && (
              <div className="file-info" title={uploadedFile.name}>
                Selected file: <strong>{uploadedFile.name}</strong>
              </div>
            )}
          </div>

          <div className="panel metrics-panel">
            <h2 className="panel-title">Metrics Summary</h2>
            <MetricsSummary metrics={metrics} />
          </div>

          <div className="panel chart-panel">
            <h2 className="panel-title">Charts</h2>

            {/* Filter Bar */}
            <div className="filter-bar" role="region" aria-label="Chart filters">
              <div className="filter-group">
                <label htmlFor="application-select" className="filter-label">Application</label>
                <select
                  id="application-select"
                  className="select"
                  value={selectedApplication || 'Application'}
                  onChange={handleApplicationChange}
                  aria-label="Select Application"
                >
                  {applicationOptions.map(opt => (
                    <option
                      key={opt}
                      value={opt}
                      disabled={opt === 'Application'}
                    >
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="month-select" className="filter-label">Month</label>
                <select
                  id="month-select"
                  className="select"
                  value={selectedMonth || 'Month'}
                  onChange={handleMonthChange}
                  aria-label="Select Month"
                >
                  {monthOptions.map(opt => (
                    <option
                      key={opt}
                      value={opt}
                      disabled={opt === 'Month'}
                    >
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <ChartPanel
              hasData={!!uploadedFile}
              application={selectedApplication}
              month={selectedMonth}
            />
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Ticket Metrics</span>
      </footer>
    </div>
  );
}

export default App;
