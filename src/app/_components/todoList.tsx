"use client";

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
    if (!todos || todos.length === 0) {
        return (
            <div className="text-center text-gray-400">
                <p className="text-lg font-semibold">No todos found</p>
                <p className="text-sm">Start by creating a new todo!</p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {todos.map((todo) => (
                <TodoCard
                    key={todo.id}
                    title={todo.title}
                    description={todo.description ?? ""}
                />
            ))}
        </div>
    );
}