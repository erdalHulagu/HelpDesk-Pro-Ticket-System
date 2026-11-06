
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

  const allLogsQuery = useGetSecurityLogsQuery();

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
  const allLogs = Array.isArray(allLogsQuery.data)
    ? allLogsQuery.data
    : [];

  const getActionCount = (action) => {
    if (action === 'ALL') return allLogs.length;

    return allLogs.filter((log) => log.action === action).length;
  };

  const statistics = [
    {
      title: 'All Logs',
      value: getActionCount('ALL'),
      action: '',
    },
    {
      title: 'Login Success',
      value: getActionCount('LOGIN_SUCCESS'),
      action: 'LOGIN_SUCCESS',
    },
    {
      title: 'Login Failed',
      value: getActionCount('LOGIN_FAILED'),
      action: 'LOGIN_FAILED',
    },
    {
      title: 'Logout',
      value: getActionCount('LOGOUT'),
      action: 'LOGOUT',
    },
  ];

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

  const handleRefresh = () => {
    allLogsQuery.refetch();

    if (activeQuery !== allLogsQuery) {
      refetch();
    }
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

  const dateInputClass =
    'h-8 rounded-md border border-stone bg-white px-2 text-xs text-charcoal outline-none focus:border-champagne dark:border-[#55595D] dark:bg-[#292D31] dark:text-ivory';

  const actionButtonClass =
    'h-8 rounded-lg border border-stone px-3 text-xs font-medium transition hover:bg-gray-100 dark:border-[#55595D] dark:hover:bg-[#44494E]';

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-stone/80 bg-white dark:border-[#55595D] dark:bg-[#34383C]">

      {/* Fixed Header */}
      <div className="shrink-0 border-b border-stone/80 dark:border-[#55595D]">

        {/* Title */}
        <div className="px-4 pt-2">
          <h2 className="text-sm font-semibold text-charcoal dark:text-ivory">
            Security Logs
          </h2>

          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Monitor login activity and security events.
          </p>
        </div>

        {/* Date Filters and Actions */}
        <div className="flex flex-wrap items-end justify-between gap-2 px-4 py-2">

          {/* Left: Date Filters */}
          <div className="flex flex-wrap items-end gap-2">

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  setExportError('');
                }}
                className={dateInputClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => {
                  setEndDate(event.target.value);
                  setExportError('');
                }}
                className={dateInputClass}
              />
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className={actionButtonClass}
            >
              Clear Filters
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isFetching || allLogsQuery.isFetching}
              className={`${actionButtonClass} disabled:opacity-50`}
            >
              {isFetching || allLogsQuery.isFetching
                ? 'Refreshing...'
                : 'Refresh'}
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="h-8 rounded-lg bg-green-600 px-3 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isExporting ? 'Exporting...' : 'Export Excel'}
            </button>
          </div>
        </div>

        {/* Export Error */}
        {exportError && (
          <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
            {exportError}
          </div>
        )}

        {/* Statistics and Search */}
        <div className="border-t border-stone/80 px-4 py-2 dark:border-[#55595D]">
          <div className="grid grid-cols-2 gap-2 xl:grid-cols-5">

            {statistics.map((stat) => {
              const isActive = selectedAction === stat.action;

              return (
                <button
                  key={stat.action || 'ALL'}
                  type="button"
                  onClick={() => setSelectedAction(stat.action)}
                  aria-pressed={isActive}
                  className={`flex min-h-[40px] items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-left transition focus:outline-none focus:ring-2 focus:ring-champagne ${
                    isActive
                      ? 'border-champagne bg-champagne/20 text-charcoal dark:text-ivory'
                      : 'border-stone/80 bg-white text-charcoal/70 hover:border-champagne hover:bg-champagne/10 dark:border-[#55595D] dark:bg-[#34383C] dark:text-ivory/70'
                  }`}
                >
                  <span className="text-xs font-semibold">
                    {stat.title}
                  </span>

                  <span className="text-base font-bold">
                    {allLogsQuery.isLoading || allLogsQuery.isError
                      ? '—'
                      : stat.value}
                  </span>
                </button>
              );
            })}

            {/* Search */}
            <div className="col-span-2 flex h-10 items-center gap-2 rounded-lg border border-stone/80 bg-white px-3 transition focus-within:border-champagne focus-within:ring-2 focus-within:ring-champagne xl:col-span-1 dark:border-[#55595D] dark:bg-[#34383C]">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-charcoal/50 dark:text-ivory/50"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search logs..."
                aria-label="Search security logs by username"
                className="h-full w-full min-w-0 bg-transparent text-xs text-charcoal outline-none placeholder:text-charcoal/40 dark:text-ivory dark:placeholder:text-ivory/40"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  className="text-lg text-charcoal/50 hover:text-charcoal dark:text-ivory/50 dark:hover:text-ivory"
                >
                  &times;
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Scrollable Table Area */}
      <div className="users-scrollbar min-h-0 flex-1 overflow-auto">

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
          <table className="w-full min-w-[850px] text-left text-sm">

            <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-500 dark:bg-[#292D31] dark:text-gray-400">
              <tr>
                <th className="px-5 py-3">Username</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">IP Address</th>
                <th className="px-5 py-3">Details</th>
                <th className="px-5 py-3">Date & Time</th>
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
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getActionStyle(log.action)}`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {log.ipAddress || '-'}
                  </td>

                  <td className="max-w-xs px-5 py-4 text-gray-600 dark:text-gray-300">
                    <span
                      className="block truncate"
                      title={log.details || ''}
                    >
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

      {/* Fixed Footer */}
      <div className="shrink-0 border-t border-stone/80 px-4 py-2 text-xs text-gray-500 dark:border-[#55595D] dark:text-gray-400">
        Showing {logs.length} security log(s)
      </div>

    </section>
  );
};

export default SecurityLogPanel;
