
const CreateTicketForm = ({
  formData,
  handleFormChange,
  handleCreateTicket,
  formError,
  formSuccess,
  isCreating,
  onBack,
}) => {
  return (
    <div className="ticket-scrollbar min-h-0 flex-1 overflow-y-auto rounded-xl border border-stone/70 bg-white p-4 shadow-sm dark:border-[#55595D] dark:bg-[#34383C] sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-champagne">
            Support
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            Create a Ticket
          </h2>

          <p className="mt-1 text-sm text-charcoal/60 dark:text-ivory/60">
            Tell us about the issue you are experiencing.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="shrink-0 rounded-full border border-stone px-3 py-2 text-xs font-medium transition hover:border-champagne hover:bg-champagne/10 dark:border-[#55595D] sm:text-sm"
        >
          Back
        </button>
      </div>

      <form
        onSubmit={handleCreateTicket}
        className="max-w-3xl space-y-4"
      >
        <div>
          <label
            htmlFor="ticket-title"
            className="mb-1.5 block text-sm font-medium"
          >
            Title
          </label>

          <input
            id="ticket-title"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            required
            maxLength={150}
            placeholder="Enter ticket title"
            className="w-full rounded-lg border border-stone bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/15 dark:border-[#55595D]"
          />
        </div>

        <div>
          <label
            htmlFor="ticket-description"
            className="mb-1.5 block text-sm font-medium"
          >
            Description
          </label>

          <textarea
            id="ticket-description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            required
            rows={4}
            placeholder="Describe your issue"
            className="w-full resize-y rounded-lg border border-stone bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/15 dark:border-[#55595D]"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="ticket-category"
              className="mb-1.5 block text-sm font-medium"
            >
              Category
            </label>

            <select
              id="ticket-category"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              className="w-full rounded-lg border border-stone bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/15 dark:border-[#55595D]"
            >
              <option value="HARDWARE">Hardware</option>
              <option value="SOFTWARE">Software</option>
              <option value="ACCESS_REQUEST">Access Request</option>
              <option value="NETWORK">Network</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="ticket-priority"
              className="mb-1.5 block text-sm font-medium"
            >
              Priority
            </label>

            <select
              id="ticket-priority"
              name="priority"
              value={formData.priority}
              onChange={handleFormChange}
              className="w-full rounded-lg border border-stone bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/15 dark:border-[#55595D]"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        {formError && (
          <p
            role="alert"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {formError}
          </p>
        )}

        {formSuccess && (
          <p
            role="status"
            className="text-sm text-emerald-700 dark:text-emerald-400"
          >
            {formSuccess}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-champagne dark:text-charcoal"
          >
            {isCreating ? 'Creating...' : 'Submit Ticket'}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-stone px-5 py-2.5 text-sm font-medium transition hover:border-champagne hover:bg-champagne/10 dark:border-[#55595D]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketForm;
