import { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  useGetSecurityLogsQuery,
  useSearchSecurityLogsByUsernameQuery,
  useFilterSecurityLogsByActionQuery,
  exportSecurityLogsExcel,
} from '../../services/securityLogApiService';

const SecurityLogPanel = () => {
  const token = useSelector((state) => state.auth?.token);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const username = searchTerm.trim();

  const allLogsQuery = useGetSecurityLogsQuery(undefined, {
    skip: Boolean(username || selectedAction),
  });

  const usernameQuery = useSearchSecurityLogsByUsernameQuery(username, {
    skip: !username,
  });

  const actionQuery = useFilterSecurityLogsByActionQuery(selectedAction, {
    skip: !selectedAction || Boolean(username),
  });

  const activeQuery = username
    ? usernameQuery
    : selectedAction
      ? actionQuery
      : allLogsQuery;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = activeQuery;

  const logs = Array.isArray(data) ? data : [];

  const formatDate = (date) => {
    if (!date) return '-';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString();
  };

  const getActionStyle = (action) => {
    switch (action) {
      case 'LOGIN_SUCCESS':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';

      case 'LOGIN_FAILED':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

      case 'LOGOUT':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';

      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedAction('');
    setStartDate('');
    setEndDate('');
    setExportError('');
  };

  const handleExport = async () => {
    if (startDate && endDate && startDate > endDate) {
      setExportError('Start Date cannot be after End Date.');
      return;
    }

    if (!token) {
      setExportError('Authentication token not found. Please log in again.');
      return;
    }

    try {
      setIsExporting(true);
      setExportError('');

      const blob = await exportSecurityLogsExcel({
        token,
        startDate,
        endDate,
      });

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'security-logs.xlsx';

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error('Security logs export error:', error);

      setExportError(
        error.message || 'Failed to export security logs.'
      );

    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-stone/80 bg-white dark:border-[#55595D] dark:bg-[#34383C]">
      {/* Scroll Container */}
      <div className=" min-h-0 flex-1 ticket-scrollbar overflow-auto">

        {/* Sticky Header and Filters */}
        <div className="sticky top-0 z-30 bg-white dark:bg-[#34383C]">

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone/80 px-4 py-2 dark:border-[#55595D]">
            <div>
              <h2 className="text-sm font-semibold">
                Security Logs
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Monitor login activity and security events.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="rounded-lg border border-stone px-3 py-1.5 text-xs font-medium hover:bg-gray-100 disabled:opacity-50 dark:border-[#55595D] dark:hover:bg-[#44494E]"
              >
                {isFetching ? 'Refreshing...' : 'Refresh'}
              </button>

              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isExporting ? 'Exporting...' : 'Export Excel'}
              </button>
            </div>
          </div>

          {/* Search Filters */}
          <div className="flex flex-wrap items-center gap-2 border-b border-stone/80 px-4 py-2 dark:border-[#55595D]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username..."
              className="min-w-[180px] flex-1 rounded-lg border border-stone bg-white px-3 py-1.5 text-xs dark:border-[#55595D] dark:bg-[#292D31]"
            />

            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="rounded-lg border border-stone bg-white px-3 py-1.5 text-xs dark:border-[#55595D] dark:bg-[#292D31]"
            >
              <option value="">All Actions</option>
              <option value="LOGIN_SUCCESS">Login Success</option>
              <option value="LOGIN_FAILED">Login Failed</option>
              <option value="LOGOUT">Logout</option>
            </select>
          </div>

          {/* Export Date Filters */}
          <div className="flex flex-wrap items-end gap-2 border-b border-stone/80 px-4 py-2 dark:border-[#55595D]">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-gray-600 dark:text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setExportError('');
                }}
                className="rounded-lg border border-stone bg-white px-2 py-1.5 text-xs dark:border-[#55595D] dark:bg-[#292D31]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-gray-600 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setExportError('');
                }}
                className="rounded-lg border border-stone bg-white px-2 py-1.5 text-xs dark:border-[#55595D] dark:bg-[#292D31]"
              />
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-[#41464B]"
            >
              Clear Filters
            </button>
          </div>

          {exportError && (
            <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
              {exportError}
            </div>
          )}

        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading security logs...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-red-500">
            Failed to load security logs. Please try again.
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No security logs found.
          </div>
        ) : (
          <table className="w-full  min-w-[850px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-500 dark:bg-[#292D31] dark:text-gray-400">
              <tr>
                <th className=" px-5 py-3">Username</th>
                <th className=" px-5 py-3">Action</th>
                <th className=" px-5 py-3">IP Address</th>
                <th className=" px-5 py-3">Details</th>
                <th className=" px-5 py-3">Date & Time</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone/70 dark:divide-[#55595D]">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="transition hover:bg-gray-50 dark:hover:bg-[#3D4247]"
                >
                  <td className="px-5 py-4 font-medium">
                    {log.username || 'Unknown'}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getActionStyle(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {log.ipAddress || '-'}
                  </td>
                  <td className="max-w-xs px-5 py-4 text-gray-600 dark:text-gray-300">
                    <span className="block truncate" title={log.details || ''}>
                      {log.details || '-'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                    {formatDate(log.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-stone/80 px-4 py-2 text-xs text-gray-500 dark:border-[#55595D] dark:text-gray-400">
        Showing {logs.length} security log(s)
      </div>

    </section>
  );
};

export default SecurityLogPanel;
