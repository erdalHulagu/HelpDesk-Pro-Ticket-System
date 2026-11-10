
import { useState } from "react";
import {
  useGetAllAssetsQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useRetireAssetMutation,
} from "../../../services/assetService";

const initialForm = {
  assetTag: "",
  name: "",
  category: "LAPTOP",
  brand: "",
  model: "",
  serialNumber: "",
  purchaseDate: "",
  warrantyExpiry: "",
  description: "",
  status: "AVAILABLE",
};

const categories = [
  "LAPTOP",
  "DESKTOP",
  "MONITOR",
  "KEYBOARD",
  "MOUSE",
  "PHONE",
  "TABLET",
  "PRINTER",
  "NETWORK_DEVICE",
  "OTHER",
];

const statuses = [
  "AVAILABLE",
  "ASSIGNED",
  "MAINTENANCE",
  "RETIRED",
  "LOST",
];

const AssetManagement = ({ onBack, darkMode }) => {
  const {
    data: assetsData,
    isLoading,
    isError,
    error,
  } = useGetAllAssetsQuery();

  const [createAsset, { isLoading: isCreating }] =
    useCreateAssetMutation();

  const [updateAsset, { isLoading: isUpdating }] =
    useUpdateAssetMutation();

  const [retireAsset] = useRetireAssetMutation();

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Supports either an array response or { data: [...] }
  const assets = Array.isArray(assetsData)
    ? assetsData
    : Array.isArray(assetsData?.data)
      ? assetsData.data
      : [];

  const filteredAssets =
    filterStatus === "ALL"
      ? assets
      : assets.filter(
          (asset) => asset.status === filterStatus
        );

  const cardClass = `rounded-xl border p-5 ${
    darkMode
      ? "border-[#55595D] bg-[#34383C]"
      : "border-stone/70 bg-white"
  }`;

  const mutedText = darkMode
    ? "text-ivory/60"
    : "text-charcoal/60";

  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm outline-none ${
    darkMode
      ? "border-[#55595D] bg-[#292D30] text-ivory"
      : "border-stone bg-white text-charcoal"
  }`;

  const buttonClass = `rounded-lg border px-4 py-2 text-sm font-medium transition ${
    darkMode
      ? "border-[#55595D] hover:bg-[#42474B]"
      : "border-stone/70 hover:bg-champagne/20"
  }`;

  const openCreateForm = () => {
    setEditingAsset(null);
    setForm(initialForm);
    setFormError("");
    setSuccessMessage("");
    setShowForm(true);
  };

  const openEditForm = (asset) => {
    setEditingAsset(asset);

    setForm({
      assetTag: asset.assetTag || "",
      name: asset.name || "",
      category: asset.category || "LAPTOP",
      brand: asset.brand || "",
      model: asset.model || "",
      serialNumber: asset.serialNumber || "",
      purchaseDate: asset.purchaseDate || "",
      warrantyExpiry: asset.warrantyExpiry || "",
      description: asset.description || "",
      status: asset.status || "AVAILABLE",
    });

    setFormError("");
    setSuccessMessage("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAsset(null);
    setForm(initialForm);
    setFormError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    try {
      const payload = {
        ...form,
        purchaseDate: form.purchaseDate || null,
        warrantyExpiry: form.warrantyExpiry || null,
      };

      if (editingAsset) {
        await updateAsset({
          id: editingAsset.id,
          ...payload,
        }).unwrap();

        setSuccessMessage("Asset updated successfully.");
      } else {
        await createAsset(payload).unwrap();

        setSuccessMessage("Asset created successfully.");
      }

      closeForm();
    } catch (err) {
      setFormError(
        err?.data?.message ||
        err?.data?.error ||
        "The operation could not be completed."
      );
    }
  };

  const handleRetire = async (asset) => {
    const confirmed = window.confirm(
      `Are you sure you want to retire ${asset.name}?`
    );

    if (!confirmed) return;

    setFormError("");
    setSuccessMessage("");

    try {
      await retireAsset(asset.id).unwrap();
      setSuccessMessage("Asset retired successfully.");
    } catch (err) {
      setFormError(
        err?.data?.message ||
        err?.data?.error ||
        "Unable to retire this asset."
      );
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      AVAILABLE: "bg-green-100 text-green-700",
      ASSIGNED: "bg-blue-100 text-blue-700",
      MAINTENANCE: "bg-yellow-100 text-yellow-700",
      RETIRED: "bg-gray-200 text-gray-700",
      LOST: "bg-red-100 text-red-700",
    };

    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const formatLabel = (value) => {
    if (!value) return "-";

    return value
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto ${
        darkMode ? "text-ivory" : "text-charcoal"
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">
            Asset Management
          </h2>

          <p className={`mt-1 text-sm ${mutedText}`}>
            Manage company equipment and assets.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-charcoal px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-ivory dark:text-charcoal"
          >
            + Add Asset
          </button>

          <button
            type="button"
            onClick={onBack}
            className={buttonClass}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {formError && !showForm && (
        <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      {/* Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Assets",
            value: assets.length,
          },
          {
            label: "Available",
            value: assets.filter(
              (asset) => asset.status === "AVAILABLE"
            ).length,
          },
          {
            label: "Assigned",
            value: assets.filter(
              (asset) => asset.status === "ASSIGNED"
            ).length,
          },
          {
            label: "Maintenance",
            value: assets.filter(
              (asset) => asset.status === "MAINTENANCE"
            ).length,
          },
        ].map((item) => (
          <div key={item.label} className={cardClass}>
            <p className={`text-sm ${mutedText}`}>
              {item.label}
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Asset Form */}
      {showForm && (
        <div className={cardClass}>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {editingAsset ? "Edit Asset" : "Add New Asset"}
            </h3>

            <button
              type="button"
              onClick={closeForm}
              className={buttonClass}
            >
              Cancel
            </button>
          </div>

          {formError && (
            <p className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
              {formError}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {[
              ["assetTag", "Asset Tag"],
              ["name", "Asset Name"],
              ["brand", "Brand"],
              ["model", "Model"],
              ["serialNumber", "Serial Number"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="mb-1 block text-sm font-medium">
                  {label}
                </label>

                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={["assetTag", "name"].includes(name)}
                  className={inputClass}
                />
              </div>
            ))}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {formatLabel(category)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Purchase Date
              </label>

              <input
                type="date"
                name="purchaseDate"
                value={form.purchaseDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Warranty Expiry
              </label>

              <input
                type="date"
                name="warrantyExpiry"
                value={form.warrantyExpiry}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {editingAsset && (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {formatLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="md:col-span-2 xl:col-span-3">
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className={inputClass}
              />
            </div>

            <div className="flex gap-2 md:col-span-2 xl:col-span-3">
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="rounded-lg bg-charcoal px-5 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-ivory dark:text-charcoal"
              >
                {isCreating || isUpdating
                  ? "Saving..."
                  : editingAsset
                    ? "Update Asset"
                    : "Create Asset"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                className={buttonClass}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Asset List */}
      <div className={cardClass}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">
            Asset Inventory
          </h3>

          <select
            value={filterStatus}
            onChange={(event) =>
              setFilterStatus(event.target.value)
            }
            className={inputClass + " max-w-48"}
          >
            <option value="ALL">All Statuses</option>

            {statuses.map((status) => (
              <option key={status} value={status}>
                {formatLabel(status)}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <p className={`py-8 text-center text-sm ${mutedText}`}>
            Loading assets...
          </p>
        ) : isError ? (
          <p className="py-8 text-center text-sm text-red-500">
            Unable to load assets. Please check the API connection.
          </p>
        ) : filteredAssets.length === 0 ? (
          <p className={`py-8 text-center text-sm ${mutedText}`}>
            No assets found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr
                  className={`border-b ${
                    darkMode
                      ? "border-[#55595D] text-ivory/60"
                      : "border-stone text-charcoal/60"
                  }`}
                >
                  <th className="px-3 py-3">Asset Tag</th>
                  <th className="px-3 py-3">Device</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Brand / Model</th>
                  <th className="px-3 py-3">Serial Number</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className={`border-b ${
                      darkMode
                        ? "border-[#55595D] hover:bg-[#42474B]"
                        : "border-stone/60 hover:bg-champagne/10"
                    }`}
                  >
                    <td className="px-3 py-3 font-medium">
                      {asset.assetTag}
                    </td>

                    <td className="px-3 py-3">
                      {asset.name}
                    </td>

                    <td className="px-3 py-3">
                      {formatLabel(asset.category)}
                    </td>

                    <td className="px-3 py-3">
                      {[asset.brand, asset.model]
                        .filter(Boolean)
                        .join(" / ") || "-"}
                    </td>

                    <td className="px-3 py-3">
                      {asset.serialNumber || "-"}
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(asset.status)}`}
                      >
                        {formatLabel(asset.status)}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(asset)}
                          className="font-medium text-blue-500 hover:underline"
                        >
                          Edit
                        </button>

                        {asset.status !== "RETIRED" &&
                          asset.status !== "LOST" && (
                            <button
                              type="button"
                              onClick={() => handleRetire(asset)}
                              className="font-medium text-red-500 hover:underline"
                            >
                              Retire
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetManagement;
