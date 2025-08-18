import { useState } from "react";
import { api } from "~/trpc/react";

interface TodoCardProps {
    id: number;
    title: string;
    description: string;
    onDelete?: () => void; // Optional callback for parent to handle UI updates
}

export function TodoCard({ id, title, description, onDelete }: TodoCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    // TRPC mutation for deleting todo
    const deleteTodo = api.todo.delete.useMutation({
        onSuccess: () => {
            console.log("Todo deleted successfully");
            onDelete?.(); // Call parent callback if provided
        },
        onError: (error) => {
            console.error("Failed to delete todo:", error);
            setIsDeleting(false);
        },
    });

    const handleDelete = async () => {
        if (isDeleting) return; // Prevent double-clicking

        setIsDeleting(true);
        deleteTodo.mutate({ id });
    };

    return (
        <div className="relative w-full max-w-xs rounded-lg bg-gray-800 p-4 shadow-lg transition hover:shadow-xl">
            {/* Delete button */}
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white transition hover:bg-red-700 disabled:opacity-50"
                aria-label="Delete todo"
            >
            </button>

            <h2 className="pr-8 text-lg font-bold text-white">{title}</h2>
            <p className="mt-2 text-sm text-gray-300">{description}</p>
        </div>
    );
}