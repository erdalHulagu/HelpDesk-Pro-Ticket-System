

const AssetTable = ({
  assets = [],
  isLoading,
  isError,
  onSelectAsset,
}) => {
  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'RETIRED':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'LOST':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatLabel = (value) => {
    if (!value) return '-';

    return String(value)
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return '-';

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) return '-';

    return parsedDate.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading assets...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load assets.
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        No assets found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Asset Tag
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Device
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Category
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Brand / Model
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Serial Number
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Warranty Expiry
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
          {assets.map((asset) => (
            <tr
              key={asset.id}
              onClick={() => onSelectAsset?.(asset)}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' ||
                  event.key === ' '
                ) {
                  event.preventDefault();
                  onSelectAsset?.(asset);
                }
              }}
              tabIndex={onSelectAsset ? 0 : undefined}
              role={onSelectAsset ? 'button' : undefined}
              className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                onSelectAsset
                  ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
                  : ''
              }`}
            >
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {asset.assetTag || '-'}
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {asset.name || '-'}
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {formatLabel(asset.category)}
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {[asset.brand, asset.model]
                  .filter(Boolean)
                  .join(' / ') || '-'}
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {asset.serialNumber || '-'}
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {formatDate(asset.warrantyExpiry)}
              </td>

              <td className="whitespace-nowrap px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                    asset.status
                  )}`}
                >
                  {formatLabel(asset.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetTable;
