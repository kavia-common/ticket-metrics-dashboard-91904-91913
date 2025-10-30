import { saveAs } from 'file-saver';

/**
 * PUBLIC_INTERFACE
 * exportAggregatedToCsv
 * Exports aggregated rows to a CSV file using a simple join.
 */
export function exportAggregatedToCsv(rows = [], fileName = 'export.csv') {
  /** This is a public function. */
  const headers = [
    'Application','MonthKey','MonthLabel','Received','Responded','Resolved',
    'ResponseAdherence%','ResolutionAdherence%','MTTR_Respond','MTTR_Resolve'
  ];
  const lines = rows.map(r => ([
    r.application,
    r.monthKey,
    r.monthLabel,
    r.received,
    r.responded,
    r.resolved,
    r.respondAdherence,
    r.resolveAdherence,
    r.mttrRespond,
    r.mttrResolve
  ].join(',')));

  const csv = [headers.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, fileName);
}

/**
 * PUBLIC_INTERFACE
 * exportPdfStub
 * Stub function to hint PDF export can be integrated; currently just alerts.
 */
export function exportPdfStub() {
  /** This is a public function. */
  alert('PDF export stub: integrate a PDF library (e.g., jsPDF) if needed.');
}
