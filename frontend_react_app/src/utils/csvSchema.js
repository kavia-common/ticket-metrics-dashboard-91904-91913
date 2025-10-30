import Papa from 'papaparse';

/**
 * PUBLIC_INTERFACE
 * parseCsvToRows
 * Parses CSV text into array of objects using PapaParse, trimming headers.
 */
export function parseCsvToRows(csvText) {
  /** This is a public function. */
  const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  const rows = (result.data || []).map(row => {
    const normalized = {};
    Object.keys(row).forEach(k => {
      if (k == null) return;
      const nk = String(k).trim();
      normalized[nk] = typeof row[k] === 'string' ? row[k].trim() : row[k];
    });
    return normalized;
  });
  return rows;
}

/**
 * Canonical column names we support; we map flexible headers to these.
 */
export const HEADER_ALIASES = {
  application: ['application', 'app', 'product'],
  month: ['month', 'period', 'date'],
  received: ['received', 'tickets_received', 'volume', 'created'],
  responded: ['responded', 'tickets_responded'],
  resolved: ['resolved', 'tickets_resolved', 'closed'],

  respondAdherence: ['response_adherence', 'respond_adherence', 'sla_response', 'resp_adh', 'response_sla_%'],
  resolveAdherence: ['resolution_adherence', 'resolve_adherence', 'sla_resolution', 'res_adh', 'resolution_sla_%'],

  mttrRespond: ['mttr_respond', 'respond_mttr', 'mttr_response', 'avg_time_to_respond', 'mean_time_to_respond'],
  mttrResolve: ['mttr_resolve', 'resolve_mttr', 'avg_time_to_resolve', 'mean_time_to_resolve'],
};

/**
 * PUBLIC_INTERFACE
 * findCanonicalKey
 * Maps a provided header name to one of the canonical fields if possible.
 */
export function findCanonicalKey(headerName) {
  /** This is a public function. */
  if (!headerName) return null;
  const h = String(headerName).toLowerCase().replace(/\s+/g, '_');
  for (const [canon, aliases] of Object.entries(HEADER_ALIASES)) {
    if (aliases.includes(h)) return canon;
  }
  if (HEADER_ALIASES[headerName]) return headerName;
  return null;
}
