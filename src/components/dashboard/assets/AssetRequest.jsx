
import { useState } from "react";
import {
    useGetMyAssetRequestsQuery,
    useGetAllAssetRequestsQuery,
    useCreateAssetRequestMutation,
    useReviewAssetRequestMutation,
    useCancelAssetRequestMutation,
    useFulfillAssetRequestMutation,
} from "../../../services/assetRequestService";

import { useGetAllAssetsQuery } from "../../../services/assetService";

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

const AssetRequest = ({ darkMode, userRole }) => {
    const isStaff = userRole === "ADMIN" || userRole === "IT_SUPPORT";

    const myQuery = useGetMyAssetRequestsQuery();
    const allQuery = useGetAllAssetRequestsQuery(undefined, {
        skip: !isStaff,
    });

    const [createRequest, { isLoading: isCreating }] =
        useCreateAssetRequestMutation();

    const [reviewRequest, { isLoading: isReviewing }] =
        useReviewAssetRequestMutation();

    const [cancelRequest] = useCancelAssetRequestMutation();

    const [fulfillRequest, { isLoading: isFulfilling }] =
        useFulfillAssetRequestMutation();

    const assetsQuery = useGetAllAssetsQuery(undefined, {
        skip: !isStaff,
    });

    const [selectedAssets, setSelectedAssets] = useState({});
    const [category, setCategory] = useState("LAPTOP");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const normalize = (response) => {
        if (Array.isArray(response)) return response;

        if (!response || typeof response !== "object") {
            return [];
        }

        const possibleLists = [
            response.data,
            response.requests,
            response.items,
            response.content,
            response.result,
        ];

        for (const list of possibleLists) {
            if (Array.isArray(list)) {
                return list;
            }

            if (list && typeof list === "object") {
                if (Array.isArray(list.data)) return list.data;
                if (Array.isArray(list.requests)) return list.requests;
            }
        }

        return [];
    };

    const myRequests = normalize(myQuery.data);
    const allRequests = normalize(allQuery.data);
    console.log("REQUEST DATA:", JSON.stringify(allQuery.data, null, 2));
    console.log("REQUEST ERROR:", allQuery.error);
    console.log("REQUEST STATUS:", allQuery.status);
    console.log("REQUEST IS ERROR:", allQuery.isError);

    const requests = isStaff ? allRequests : myRequests;
    const assets = normalize(assetsQuery.data);

    const getAvailableAssets = (assetCategory) =>
        assets.filter(
            (asset) =>
                asset.status === "AVAILABLE" &&
                asset.category === assetCategory
        );

    const cardClass = `rounded-xl border p-5 ${darkMode
        ? "border-[#55595D] bg-[#34383C]"
        : "border-stone/70 bg-white"
        }`;

    const inputClass = `w-full rounded-lg border px-3 py-2 text-sm ${darkMode
        ? "border-[#55595D] bg-[#292D30] text-ivory"
        : "border-stone bg-white text-charcoal"
        }`;

    const mutedText = darkMode
        ? "text-ivory/60"
        : "text-charcoal/60";

    const handleCreate = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!description.trim()) {
            setError("Please enter a description.");
            return;
        }

        try {
            await createRequest({
                category,
                description: description.trim(),
            }).unwrap();

            setMessage("Equipment request created successfully.");
            setDescription("");
            setCategory("LAPTOP");
        } catch (err) {
            setError(
                err?.data?.message ||
                err?.data?.error ||
                "Unable to create request."
            );
        }
    };

    const handleReview = async (id, status) => {
        setError("");
        setMessage("");

        try {
            await reviewRequest({ id, status }).unwrap();
            setMessage(`Request ${status.toLowerCase()} successfully.`);
        } catch (err) {
            setError(
                err?.data?.message ||
                err?.data?.error ||
                "Unable to review request."
            );
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this request?")) {
            return;
        }

        setError("");
        setMessage("");

        try {
            await cancelRequest(id).unwrap();
            setMessage("Request cancelled successfully.");
        } catch (err) {
            setError(
                err?.data?.message ||
                err?.data?.error ||
                "Unable to cancel request."
            );
        }
    };

    const handleFulfill = async (requestId) => {
        const assetId = selectedAssets[requestId];

        if (!assetId) {
            setError("Please select an available asset.");
            return;
        }

        setError("");
        setMessage("");

        try {
            await fulfillRequest({
                id: requestId,
                assetId: Number(assetId),
            }).unwrap();

            setMessage("Equipment request fulfilled successfully.");

            setSelectedAssets((previous) => {
                const updated = { ...previous };
                delete updated[requestId];
                return updated;
            });
        } catch (err) {
            setError(
                err?.data?.message ||
                err?.data?.error ||
                "Unable to fulfill request."
            );
        }
    };

    const formatDate = (date) =>
        date ? new Date(date).toLocaleString() : "-";

    const statusClass = (status) => {
        switch (status) {
            case "APPROVED":
                return "bg-green-100 text-green-700";
            case "REJECTED":
                return "bg-red-100 text-red-700";
            case "FULFILLED":
                return "bg-blue-100 text-blue-700";
            case "CANCELLED":
                return "bg-gray-200 text-gray-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    return (
        <div className={`flex flex-col gap-5 ${darkMode ? "text-ivory" : "text-charcoal"}`}>
            <div>
                <h2 className="text-xl font-semibold">
                    Equipment Requests
                </h2>
                <p className={`mt-1 text-sm ${mutedText}`}>
                    {isStaff
                        ? "Review and manage employee equipment requests."
                        : "Request equipment and track your requests."}
                </p>
            </div>

            {error && (
                <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {message && (
                <div className="rounded-lg bg-green-100 p-3 text-sm text-green-700">
                    {message}
                </div>
            )}

            {!isStaff && (
                <div className={cardClass}>
                    <h3 className="mb-4 text-lg font-semibold">
                        Request Equipment
                    </h3>

                    <form onSubmit={handleCreate} className="flex flex-col gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Equipment Category
                            </label>
                            <select
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                                className={inputClass}
                            >
                                {categories.map((item) => (
                                    <option key={item} value={item}>
                                        {item.replaceAll("_", " ")}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                rows={3}
                                required
                                placeholder="Explain why you need this equipment..."
                                className={inputClass}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isCreating}
                            className="self-start rounded-lg bg-charcoal px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-ivory dark:text-charcoal"
                        >
                            {isCreating ? "Submitting..." : "Submit Request"}
                        </button>
                    </form>
                </div>
            )}

            <div className={cardClass}>
                <h3 className="mb-4 text-lg font-semibold">
                    {isStaff ? "All Equipment Requests" : "My Equipment Requests"}
                </h3>

                {(isStaff ? allQuery.isLoading : myQuery.isLoading) ? (
                    <p className={`py-6 text-center text-sm ${mutedText}`}>
                        Loading requests...
                    </p>
                ) : (isStaff ? allQuery.isError : myQuery.isError) ? (
                    <p className="py-6 text-center text-sm text-red-500">
                        Unable to load equipment requests.
                    </p>
                ) : requests.length === 0 ? (
                    <p className={`py-6 text-center text-sm ${mutedText}`}>
                        No equipment requests found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead>
                                <tr className={`border-b ${darkMode
                                    ? "border-[#55595D] text-ivory/60"
                                    : "border-stone text-charcoal/60"
                                    }`}>
                                    {isStaff && <th className="px-3 py-3">Employee</th>}
                                    <th className="px-3 py-3">Category</th>
                                    <th className="px-3 py-3">Description</th>
                                    <th className="px-3 py-3">Created At</th>
                                    <th className="px-3 py-3">Status</th>
                                    <th className="px-3 py-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {requests.map((request) => (
                                    <tr
                                        key={request.id}
                                        className={`border-b ${darkMode
                                            ? "border-[#55595D]"
                                            : "border-stone/60"
                                            }`}
                                    >
                                        {isStaff && (
                                            <td className="px-3 py-3">
                                                {request.user?.fullName ||
                                                    request.user?.email ||
                                                    `User #${request.user?.id || "-"}`}
                                            </td>
                                        )}

                                        <td className="px-3 py-3">
                                            {request.category?.replaceAll("_", " ")}
                                        </td>

                                        <td className="px-3 py-3">
                                            {request.description}
                                        </td>

                                        <td className="px-3 py-3">
                                            {formatDate(request.createdAt)}
                                        </td>

                                        <td className="px-3 py-3">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>

                                        <td className="px-3 py-3">
                                            {isStaff && request.status === "PENDING" && (
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        disabled={isReviewing}
                                                        onClick={() => handleReview(request.id, "APPROVED")}
                                                        className="font-medium text-green-600 hover:underline"
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={isReviewing}
                                                        onClick={() => handleReview(request.id, "REJECTED")}
                                                        className="font-medium text-red-500 hover:underline"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                            {isStaff && request.status === "APPROVED" && (
                                                <div className="flex min-w-[220px] flex-col gap-2">
                                                    <select
                                                        value={selectedAssets[request.id] || ""}
                                                        onChange={(event) =>
                                                            setSelectedAssets((previous) => ({
                                                                ...previous,
                                                                [request.id]: event.target.value,
                                                            }))
                                                        }
                                                        className={inputClass}
                                                    >
                                                        <option value="">
                                                            Select available equipment
                                                        </option>

                                                        {getAvailableAssets(request.category).map((asset) => (
                                                            <option key={asset.id} value={asset.id}>
                                                                {asset.assetTag} - {asset.name}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isFulfilling ||
                                                            !selectedAssets[request.id] ||
                                                            getAvailableAssets(request.category).length === 0
                                                        }
                                                        onClick={() => handleFulfill(request.id)}
                                                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        {isFulfilling ? "Processing..." : "Fulfill Request"}
                                                    </button>

                                                    {getAvailableAssets(request.category).length === 0 && (
                                                        <span className="text-xs text-red-500">
                                                            No available equipment in this category.
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {!isStaff && request.status === "PENDING" && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancel(request.id)}
                                                    className="font-medium text-red-500 hover:underline"
                                                >
                                                    Cancel
                                                </button>
                                            )}

                                            {(
                                                request.status === "FULFILLED" ||
                                                request.status === "REJECTED" ||
                                                request.status === "CANCELLED"
                                            ) && "-"}
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

export default AssetRequest;
