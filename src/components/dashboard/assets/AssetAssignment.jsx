
import { useState } from "react";

import {
    useGetAllAssignmentsQuery,
    useAssignAssetMutation,
    useReturnAssetMutation,
} from "../../services/assetAssignmentApi";

import { useGetAllAssetsQuery } from "../../../services/assetApi";
import { useGetAllUsersQuery } from "../../../services/userService";

const AssetAssignment = ({ darkMode }) => {
    const {
        data: assignmentsData,
        isLoading: assignmentsLoading,
        isError: assignmentsError,
    } = useGetAllAssignmentsQuery();


    const {
        data: assetsData,
        isLoading: assetsLoading,
        isError: assetsError,
        error: assetsErrorData,
    } = useGetAllAssetsQuery();

    const {
        data: usersData,
        isLoading: usersLoading,
        isError: usersError,
        error: usersErrorData,
    } = useGetAllUsersQuery();

    const [assignAsset, { isLoading: isAssigning }] =
        useAssignAssetMutation();

    const [returnAsset] = useReturnAssetMutation();

    const [assetId, setAssetId] = useState("");
    const [userId, setUserId] = useState("");
    const [notes, setNotes] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const assignments = Array.isArray(assignmentsData)
        ? assignmentsData
        : Array.isArray(assignmentsData?.data)
            ? assignmentsData.data
            : [];

    const assets = Array.isArray(assetsData)
        ? assetsData
        : Array.isArray(assetsData?.data)
            ? assetsData.data
            : [];

    const users = Array.isArray(usersData)
        ? usersData
        : Array.isArray(usersData?.data)
            ? usersData.data
            : [];

    const availableAssets = assets.filter(
        (asset) => asset.status === "AVAILABLE"
    );

    const employees = users.filter(
        (user) => user.role === "EMPLOYEE" && user.isActive !== false
    );

    const activeAssignments = assignments.filter(
        (assignment) => !assignment.returnedAt
    );

    const cardClass = `rounded-xl border p-5 ${darkMode
        ? "border-[#55595D] bg-[#34383C]"
        : "border-stone/70 bg-white"
        }`;

    const inputClass = `w-full rounded-lg border px-3 py-2 text-sm outline-none ${darkMode
        ? "border-[#55595D] bg-[#292D30] text-ivory"
        : "border-stone bg-white text-charcoal"
        }`;

    const mutedText = darkMode
        ? "text-ivory/60"
        : "text-charcoal/60";

    const handleAssign = async (event) => {
        event.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        if (!assetId || !userId) {
            setErrorMessage("Please select an asset and an employee.");
            return;
        }

        try {
            await assignAsset({
                assetId: Number(assetId),
                userId: Number(userId),
                notes,
            }).unwrap();

            setSuccessMessage("Asset assigned successfully.");

            setAssetId("");
            setUserId("");
            setNotes("");
        } catch (error) {
            setErrorMessage(
                error?.data?.message ||
                error?.data?.error ||
                "Unable to assign asset."
            );
        }
    };

    const handleReturn = async (assignmentId) => {
        const confirmed = window.confirm(
            "Are you sure you want to return this asset?"
        );

        if (!confirmed) return;

        setErrorMessage("");
        setSuccessMessage("");

        try {
            await returnAsset(assignmentId).unwrap();
            setSuccessMessage("Asset returned successfully.");
        } catch (error) {
            setErrorMessage(
                error?.data?.message ||
                error?.data?.error ||
                "Unable to return asset."
            );
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString();
    };

    const getEmployeeName = (user) => {
        if (!user) return "Unknown Employee";

        return (
            user.fullName ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.email ||
            `User #${user.id}`
        );
    };

    const getStatus = (assignment) => {
        return assignment.returnedAt ? "Returned" : "Active";
    };

    return (
        <div
            className={`flex flex-col gap-5 ${darkMode ? "text-ivory" : "text-charcoal"
                }`}
        >
            <div>
                <h2 className="text-xl font-semibold">
                    Asset Assignment
                </h2>

                <p className={`mt-1 text-sm ${mutedText}`}>
                    Assign equipment to employees and manage returns.
                </p>
            </div>

            {errorMessage && (
                <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div className="rounded-lg bg-green-100 p-3 text-sm text-green-700">
                    {successMessage}
                </div>
            )}

            {/* Assignment Form */}
            <div className={cardClass}>
                <h3 className="mb-4 text-lg font-semibold">
                    Assign New Asset
                </h3>

                <form
                    onSubmit={handleAssign}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Select Asset
                        </label>

                        <select
                            value={assetId}
                            onChange={(event) => setAssetId(event.target.value)}
                            className={inputClass}
                            required
                        >
                            <option value="">Select an available asset</option>

                            {availableAssets.map((asset) => (
                                <option key={asset.id} value={asset.id}>
                                    {asset.assetTag} - {asset.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Select Employee
                        </label>

                        <select
                            value={userId}
                            onChange={(event) => setUserId(event.target.value)}
                            className={inputClass}
                            required
                        >
                            <option value="">Select an employee</option>

                            {employees.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {getEmployeeName(user)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium">
                            Notes
                        </label>

                        <textarea
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            rows={3}
                            placeholder="Optional assignment notes..."
                            className={inputClass}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={
                                isAssigning ||
                                assetsLoading ||
                                usersLoading ||
                                availableAssets.length === 0 ||
                                employees.length === 0
                            }
                            className="rounded-lg bg-charcoal px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-ivory dark:text-charcoal"
                        >
                            {isAssigning ? "Assigning..." : "Assign Asset"}
                        </button>
                    </div>
                </form>

                {!assetsLoading && availableAssets.length === 0 && (
                    <p className={`mt-3 text-sm ${mutedText}`}>
                        No available assets found.
                    </p>
                )}

                {!usersLoading && employees.length === 0 && (
                    <p className={`mt-3 text-sm ${mutedText}`}>
                        No active employees found.
                    </p>
                )}

                {assetsError && (
                    <p className="mt-3 text-sm text-red-500">
                        {assetsErrorData?.data?.message ||
                            "Unable to load assets."}
                    </p>
                )}

                {usersError && (
                    <p className="mt-3 text-sm text-red-500">
                        {usersErrorData?.data?.message ||
                            "Unable to load employees."}
                    </p>
                )}
            </div>

            {/* Active Assignments */}
            <div className={cardClass}>
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        Active Assignments
                    </h3>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {activeAssignments.length} Active
                    </span>
                </div>

                {assignmentsLoading ? (
                    <p className={`py-6 text-center text-sm ${mutedText}`}>
                        Loading assignments...
                    </p>
                ) : assignmentsError ? (
                    <p className="py-6 text-center text-sm text-red-500">
                        Unable to load assignments.
                    </p>
                ) : activeAssignments.length === 0 ? (
                    <p className={`py-6 text-center text-sm ${mutedText}`}>
                        No active assignments found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead>
                                <tr
                                    className={`border-b ${darkMode
                                        ? "border-[#55595D] text-ivory/60"
                                        : "border-stone text-charcoal/60"
                                        }`}
                                >
                                    <th className="px-3 py-3">Asset</th>
                                    <th className="px-3 py-3">Employee</th>
                                    <th className="px-3 py-3">Assigned At</th>
                                    <th className="px-3 py-3">Notes</th>
                                    <th className="px-3 py-3">Status</th>
                                    <th className="px-3 py-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {activeAssignments.map((assignment) => (
                                    <tr
                                        key={assignment.id}
                                        className={`border-b ${darkMode
                                            ? "border-[#55595D] hover:bg-[#42474B]"
                                            : "border-stone/60 hover:bg-champagne/10"
                                            }`}
                                    >
                                        <td className="px-3 py-3">
                                            <div className="font-medium">
                                                {assignment.asset?.assetTag || "-"}
                                            </div>
                                            <div className={mutedText}>
                                                {assignment.asset?.name || "-"}
                                            </div>
                                        </td>

                                        <td className="px-3 py-3">
                                            {getEmployeeName(assignment.user)}
                                        </td>

                                        <td className="px-3 py-3">
                                            {formatDate(assignment.assignedAt)}
                                        </td>

                                        <td className="px-3 py-3">
                                            {assignment.notes || "-"}
                                        </td>

                                        <td className="px-3 py-3">
                                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                                {getStatus(assignment)}
                                            </span>
                                        </td>

                                        <td className="px-3 py-3">
                                            <button
                                                type="button"
                                                onClick={() => handleReturn(assignment.id)}
                                                className="font-medium text-red-500 hover:underline"
                                            >
                                                Return Asset
                                            </button>
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

export default AssetAssignment;
