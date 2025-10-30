import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import UploadArea from './components/UploadArea';
import MetricsSummary from './components/MetricsSummary';
import MenuNav from './components/MenuNav';
import FiltersBar from './components/FiltersBar';
import SummaryCards from './components/SummaryCards';
import DrillDownModal from './components/modals/DrillDownModal';
import GaugeChart from './components/charts/GaugeChart';
import TotalTicketsPanel from './components/panels/TotalTicketsPanel';

import TicketVolumeView from './views/TicketVolumeView';
import ResponseView from './views/ResponseView';
import ResolutionView from './views/ResolutionView';
import SLAOverviewView from './views/SLAOverviewView';

import { parseCsvToRows } from './utils/csvSchema';
import { normalizeRows } from './utils/normalize';
import { filterNormalizedRows } from './utils/aggregate';
import { exportAggregatedToCsv, exportPdfStub } from './utils/exporters';
import { useFilteredData } from './utils/useFilteredData';

/**
 * View Modes for menu navigation
 */
const VIEW_MODES = {
  VOLUME: 'Ticket Volume',
  RESPOND: 'Response Efficiency',
  RESOLVE: 'Resolution Efficiency',
  SLA: 'SLA Adherence Overview',
};

// PUBLIC_INTERFACE
function App() {
  /**
   * Main dashboard controller:
   * - Handles theme switching
   * - Handles CSV upload and parsing via PapaParse
   * - Normalizes rows and aggregates by Application+Month (YYYY-MM)
   * - Maintains filters and derived options
   * - Renders menu-driven chart views, summary cards, and drill-down
   */
  const [theme, setTheme] = useState('light');

  // Data states
  const [rawRows, setRawRows] = useState([]);
  const [normalizedRows, setNormalizedRows] = useState([]);

  // Filters and view
  const [filters, setFilters] = useState({
    applications: [], // array of selected application names
    monthStart: null, // YYYY-MM
    monthEnd: null,   // YYYY-MM
  });
  const [viewMode, setViewMode] = useState(VIEW_MODES.VOLUME);

  // UI states
  const [fileMeta, setFileMeta] = useState({ name: '', rows: 0 });
  const [drillDown, setDrillDown] = useState({ open: false, application: null, monthKey: null });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // Handle CSV upload and parsing
  const handleCsvLoaded = async (file, csvText) => {
    const rows = parseCsvToRows(csvText);
    setRawRows(rows);
    setFileMeta({ name: file.name, rows: rows.length });

    const norm = normalizeRows(rows);
    setNormalizedRows(norm);

    // Initialize filters based on available data (use hook later to compute month range if needed)
    setFilters(prev => ({ ...prev }));
  };

  // Centralized derived data
  const {
    options,
    monthRange,
    filteredRows,
    filteredAgg,
    summary,
    receivedByApp,
    currentValue,
    maxValue,
  } = useFilteredData(normalizedRows, filters);

  // When first data is loaded, if no month range set, set from monthRange
  useEffect(() => {
    if (!filters.monthStart && monthRange?.start) {
      setFilters(f => ({ ...f, monthStart: monthRange.start, monthEnd: monthRange.end }));
    }
  }, [monthRange, filters.monthStart]);

  const onExportCsv = () => {
    exportAggregatedToCsv(filteredAgg, `metrics_export_${filters.monthStart || 'all'}_${filters.monthEnd || 'all'}.csv`);
  };
  const onExportPdf = () => {
    exportPdfStub();
  };

  const openDrillDown = (application, monthKey) => setDrillDown({ open: true, application, monthKey });
  const closeDrillDown = () => setDrillDown({ open: false, application: null, monthKey: null });

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
          <span className="theme-badge" aria-label={`Current theme: ${theme}`}>{theme === 'light' ? 'Light' : 'Dark'}</span>
          <button className="btn theme-toggle-btn" onClick={toggleTheme} aria-label={`Switch theme`} title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>

      {/* Page Header */}
      <header className="page-hero">
        <div className="page-hero-inner">
          <h1 className="page-title">Insights at a glance</h1>
          <p className="page-subtitle">Upload a CSV to view metrics and visualize trends by Application and Month.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="content">
        <section className="content-grid">
          <div className="panel upload-panel">
            <h2 className="panel-title">Upload Data</h2>
            <p className="panel-description">Select your metrics CSV. Required columns include Application and Month along with counts/times.</p>
            <UploadArea onCsvParsed={handleCsvLoaded} />
            {fileMeta.name ? (
              <div className="file-info">Loaded: <strong>{fileMeta.name}</strong> • Rows: <strong>{fileMeta.rows}</strong></div>
            ) : null}
          </div>

          <div className="panel metrics-panel">
            <h2 className="panel-title">Summary</h2>
            <SummaryCards
              totalTickets={summary.totalTickets}
              avgRespondMTTR={summary.avgRespondMTTR}
              avgResolveMTTR={summary.avgResolveMTTR}
              respondAdh={summary.respondAdh}
              resolveAdh={summary.resolveAdh}
              onExportCsv={onExportCsv}
              onExportPdf={onExportPdf}
              disabled={!normalizedRows.length}
            />
          </div>

          <div className="panel chart-panel">
            <h2 className="panel-title">Explore</h2>

            <MenuNav
              viewMode={viewMode}
              setViewMode={setViewMode}
              items={[
                VIEW_MODES.VOLUME,
                VIEW_MODES.RESPOND,
                VIEW_MODES.RESOLVE,
                VIEW_MODES.SLA,
              ]}
            />

            <FiltersBar
              options={options}
              filters={filters}
              onChange={setFilters}
              disabled={!normalizedRows.length}
            />

            {!normalizedRows.length ? (
              <div className="chart-placeholder">
                <div className="empty-state">
                  <div className="empty-illustration" aria-hidden="true">📊</div>
                  <div className="empty-title">No data yet</div>
                  <div className="empty-desc">Upload a CSV to visualize ticket trends.</div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 1.4fr', gap: 12, marginBottom: 12 }}>
                  <TotalTicketsPanel
                    value={currentValue}
                    title={(filters.applications || []).length === 1 ? `Total Tickets — ${(filters.applications || [])[0]}` : 'Total Tickets — All'}
                    subtitle={'Source: "No of Tickets Received"'}
                  />
                  <GaugeChart
                    value={currentValue}
                    max={maxValue || 1}
                    title={(filters.applications || []).length === 1 ? `Tickets Received — ${(filters.applications || [])[0]}` : 'Tickets Received — All'}
                    caption={'"No of Tickets Received"'}
                    height={220}
                  />
                </div>

                {viewMode === VIEW_MODES.VOLUME && (
                  <TicketVolumeView data={filteredAgg} onPointClick={openDrillDown} />
                )}
                {viewMode === VIEW_MODES.RESPOND && (
                  <ResponseView data={filteredAgg} onPointClick={openDrillDown} />
                )}
                {viewMode === VIEW_MODES.RESOLVE && (
                  <ResolutionView data={filteredAgg} onPointClick={openDrillDown} />
                )}
                {viewMode === VIEW_MODES.SLA && (
                  <SLAOverviewView data={filteredAgg} onPointClick={openDrillDown} />
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Ticket Metrics</span>
      </footer>

      <DrillDownModal
        open={drillDown.open}
        onClose={closeDrillDown}
        application={drillDown.application}
        monthKey={drillDown.monthKey}
        rows={filterNormalizedRows(normalizedRows, {
          applications: drillDown.application ? [drillDown.application] : [],
          monthStart: drillDown.monthKey,
          monthEnd: drillDown.monthKey,
        })}
      />
    </div>
  );
}

export default App;
