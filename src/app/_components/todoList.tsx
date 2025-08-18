"use client";

import { api } from "~/trpc/react";
import { TodoCard } from "./todoCard";

interface Todo {
    id: number;
    title: string | null;
    description: string | null;
    priority: number | null;
    userId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface TodoListProps {
    todos: Todo[];
}

export function TodoList({ todos }: TodoListProps) {
    // Use TRPC utils to refresh the todo list after deletion
    const utils = api.useUtils();

    const handleTodoDelete = () => {
        // Invalidate and refetch the todos list
        void utils.todo.getAll.invalidate();
    };

    if (!todos || todos.length === 0) {
        return (
            <div className="text-center text-gray-500">
                No todos found. Create your first todo!
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todos.map((todo) => (
                <TodoCard
                    key={todo.id}
                    id={todo.id}
                    title={todo.title || "Untitled"}
                    description={todo.description || "No description"}
                    onDelete={handleTodoDelete}
                />
            ))}
        </div>
    );
}