
import { useState } from 'react';

import {
    useGetAllAnnouncementsQuery,
    useCreateAnnouncementMutation,
    useUpdateAnnouncementMutation,
    useDeleteAnnouncementMutation,
} from '../../services/announcementService';

const initialForm = {
    title: '',
    message: '',
    targetRole: '',
    expiresAt: '',
    pinned: false,
    active: true,
};

const AnnouncementManagement = () => {
    const {
        data: announcements,
        isLoading,
        isError,
    } = useGetAllAnnouncementsQuery();

    const [createAnnouncement, { isLoading: isCreating }] =
        useCreateAnnouncementMutation();

    const [updateAnnouncement, { isLoading: isUpdating }] =
        useUpdateAnnouncementMutation();

    const [deleteAnnouncement, { isLoading: isDeleting }] =
        useDeleteAnnouncementMutation();

    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const allAnnouncements = Array.isArray(announcements)
        ? announcements
        : [];

    const isSaving = isCreating || isUpdating;

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
        setShowForm(false);
        setErrorMessage('');
    };

    const handleNewAnnouncement = () => {
        resetForm();
        setShowForm(true);
        setSuccessMessage('');
    };

    const handleEdit = (announcement) => {
        setForm({
            title: announcement.title || '',
            message: announcement.message || '',
            targetRole: announcement.targetRole || '',
            expiresAt: announcement.expiresAt
                ? announcement.expiresAt.slice(0, 16)
                : '',
            pinned: Boolean(announcement.pinned),
            active: Boolean(announcement.active),
        });

        setEditingId(announcement.id);
        setShowForm(true);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrorMessage('');
        setSuccessMessage('');

        if (!form.title.trim() || !form.message.trim()) {
            setErrorMessage('Title and message are required.');
            return;
        }

        const announcementData = {
            title: form.title.trim(),
            message: form.message.trim(),
            targetRole: form.targetRole || null,
            expiresAt: form.expiresAt
                ? form.expiresAt.length === 16
                    ? `${form.expiresAt}:00`
                    : form.expiresAt
                : null,
            pinned: form.pinned,
            active: form.active,
        };

        try {
            if (editingId !== null) {
                await updateAnnouncement({
                    id: editingId,
                    ...announcementData,
                }).unwrap();

                setSuccessMessage('Announcement updated successfully.');
            } else {
                await createAnnouncement(announcementData).unwrap();

                setSuccessMessage('Announcement created successfully.');
            }

            resetForm();
        } catch (error) {
            setErrorMessage(
                error?.data?.error ||
                error?.data?.message ||
                'Something went wrong. Please try again.'
            );
        }
    };

    const handleDelete = async (announcementId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this announcement?'
        );

        if (!confirmed) return;

        setErrorMessage('');
        setSuccessMessage('');

        try {
            await deleteAnnouncement(announcementId).unwrap();

            setSuccessMessage('Announcement deleted successfully.');

            if (editingId === announcementId) {
                resetForm();
            }
        } catch (error) {
            setErrorMessage(
                error?.data?.error ||
                error?.data?.message ||
                'Unable to delete announcement.'
            );
        }
    };

    const formatDate = (date) => {
        if (!date) return 'No expiry date';

        return new Date(date).toLocaleString();
    };

    const inputClass =
        'w-full rounded-lg border border-stone bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-[#55595D] dark:bg-[#292D31] dark:text-white dark:focus:ring-blue-900';

    const labelClass =
        'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300';

    return (
        <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-stone/80 bg-white dark:border-[#55595D] dark:bg-[#34383C]">

            {/* Fixed Header */}
            <div className="shrink-0 border-b border-stone/80 dark:border-[#55595D]">

                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">

                    <div>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Announcement Center
                        </h2>

                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Create and manage system announcements.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleNewAnnouncement}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                        + New Announcement
                    </button>

                </div>

                {/* Feedback */}
                {(successMessage || errorMessage) && (
                    <div className="px-4 pb-2">
                        {successMessage && (
                            <div
                                role="status"
                                className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
                            >
                                {successMessage}
                            </div>
                        )}

                        {errorMessage && (
                            <div
                                role="alert"
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                            >
                                {errorMessage}
                            </div>
                        )}
                    </div>
                )}

                {/* Create / Edit Form */}
                {showForm && (
                    <div className="border-t border-stone/80 px-4 py-3 dark:border-[#55595D]">

                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                {editingId !== null
                                    ? 'Edit Announcement'
                                    : 'Create Announcement'}
                            </h3>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">

                            <div>
                                <label className={labelClass}>
                                    Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    maxLength={150}
                                    required
                                    placeholder="Enter announcement title"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Message
                                </label>

                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    maxLength={2000}
                                    required
                                    rows={3}
                                    placeholder="Write your announcement..."
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                <div>
                                    <label className={labelClass}>
                                        Target Audience
                                    </label>

                                    <select
                                        name="targetRole"
                                        value={form.targetRole}
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        <option value="">All Roles</option>
                                        <option value="EMPLOYEE">Employee</option>
                                        <option value="IT_SUPPORT">IT Support</option>
                                        <option value="IT_MANAGER">IT Manager</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Expiry Date
                                    </label>

                                    <input
                                        type="datetime-local"
                                        name="expiresAt"
                                        value={form.expiresAt}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>

                            </div>

                            <div className="flex flex-wrap gap-6">

                                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <input
                                        type="checkbox"
                                        name="pinned"
                                        checked={form.pinned}
                                        onChange={handleChange}
                                        className="h-4 w-4 accent-blue-600"
                                    />
                                    Pin Announcement
                                </label>

                                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <input
                                        type="checkbox"
                                        name="active"
                                        checked={form.active}
                                        onChange={handleChange}
                                        className="h-4 w-4 accent-blue-600"
                                    />
                                    Active
                                </label>

                            </div>

                            <div className="flex flex-wrap justify-end gap-2 border-t border-stone/80 pt-3 dark:border-[#55595D]">

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-lg border border-stone px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-[#55595D] dark:text-gray-300 dark:hover:bg-[#292D31]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSaving
                                        ? 'Saving...'
                                        : editingId !== null
                                            ? 'Update Announcement'
                                            : 'Create Announcement'}
                                </button>

                            </div>

                        </form>
                    </div>
                )}

            </div>

            {/* Scrollable Announcement List */}
            <div className="users-scrollbar min-h-0 flex-1 overflow-y-auto">

                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone/80 bg-gray-50 px-4 py-3 dark:border-[#55595D] dark:bg-[#292D31]">

                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white ">
                        All Announcements
                    </h3>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-[#34383C] dark:text-gray-300">
                        {allAnnouncements.length} Total
                    </span>

                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Loading announcements...
                    </div>
                ) : isError ? (
                    <div className="p-8 text-center text-sm text-red-600 dark:text-red-400">
                        Unable to load announcements.
                    </div>
                ) : allAnnouncements.length === 0 ? (
                    <div className="p-10 text-center">
                        <p className="font-medium text-gray-700 dark:text-gray-200">
                            No announcements yet
                        </p>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Create your first announcement to share important updates.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-stone/80 dark:divide-[#55595D]">

                        {allAnnouncements.map((announcement) => (
                            <article
                                key={announcement.id}
                                className="p-4 transition hover:bg-gray-50 dark:hover:bg-[#292D31]"
                            >

                                <div className="flex flex-wrap items-start justify-between gap-3">

                                    <div className="min-w-0 flex-1">

                                        <div className="mb-2 flex flex-wrap items-center gap-2">

                                            <h4 className="break-words text-sm font-semibold text-gray-900 dark:text-white">
                                                {announcement.title}
                                            </h4>

                                            {announcement.pinned && (
                                                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                                    Pinned
                                                </span>
                                            )}

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    announcement.active
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                {announcement.active ? 'Active' : 'Inactive'}
                                            </span>

                                        </div>

                                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-600 dark:text-gray-300">
                                            {announcement.message}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500 dark:text-gray-400">

                                            <span>
                                                Audience: {announcement.targetRole || 'All Roles'}
                                            </span>

                                            <span>
                                                Created by: {announcement.createdByUsername || 'Unknown'}
                                            </span>

                                            <span>
                                                Created: {formatDate(announcement.createdAt)}
                                            </span>

                                            <span>
                                                Expires: {formatDate(announcement.expiresAt)}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="flex shrink-0 gap-2">

                                        <button
                                            type="button"
                                            onClick={() => handleEdit(announcement)}
                                            className="rounded-lg border border-stone px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-[#55595D] dark:text-gray-300 dark:hover:bg-[#34383C]"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(announcement.id)}
                                            disabled={isDeleting}
                                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </div>

            {/* Fixed Footer */}
            <div className="shrink-0 border-t border-stone/80 px-4 py-2 text-xs text-gray-500 dark:border-[#55595D] dark:text-gray-400">
                Showing {allAnnouncements.length} announcement(s)
            </div>

        </section>
    );
};

export default AnnouncementManagement;
