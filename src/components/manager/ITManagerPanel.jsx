
import AnnouncementManagement from '../admin/AnnouncementManagement';

const ITManagerPanel = ({ onBack }) => {
    return (
        <div className="mx-auto  flex h-full w-full max-w-6xl flex-col overflow-hidden">

            <header className="mb-4 flex shrink-0 items-center justify-between border-b border-stone/80 pb-4 dark:border-[#55595D]">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-champagne">
                        Helpdesk Portal
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                        IT Manager Panel
                    </h2>

                    <p className="mt-1 text-sm opacity-60">
                        Manage announcements and important updates.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onBack}
                    className="rounded-lg border border-stone/70 px-4 py-2 text-sm font-semibold transition hover:border-champagne hover:bg-champagne/10"
                >
                    Back
                </button>
            </header>

            <div className="min-h-0 flex-1 notification-scrollbar overflow-auto">
                <AnnouncementManagement />
            </div>

        </div>
    );
};

export default ITManagerPanel;
