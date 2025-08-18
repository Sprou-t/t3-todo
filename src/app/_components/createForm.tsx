"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function CreateForm() {
    // const [allTodos] = api.todo.getAll.useSuspenseQuery();

    const utils = api.useUtils();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const createTodo = api.todo.create.useMutation({
        onSuccess: async () => {
            await utils.todo.invalidate();
            setTitle("");
            setDescription("");
        },
    });

    return (
        <div className="w-full max-w-xs">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    createTodo.mutate({ title, description });
                }}
                className="flex flex-col gap-2"
            >
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
                />
                <button
                    type="submit"
                    className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
                    disabled={createTodo.isPending}
                >
                    {/**The createTodo.isPending in the <button> element is a property provided by the useMutation hook from tRPC */}
                    {createTodo.isPending ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
}
