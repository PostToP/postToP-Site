export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
            <div className="bg-white rounded-lg p-6 z-10 w-full max-w-sm">
                <h2 className="text-xl font-medium mb-4">Confirm Deletion</h2>
                <p className="mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
