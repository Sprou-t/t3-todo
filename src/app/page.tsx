"use client"

import { useState } from "react";
import { TodoList } from "~/app/_components/todoList";
import { api } from "~/trpc/react";
import { CreateForm } from "./_components/createForm";

export default function Home() {
    const { data: todos, isLoading } = api.todo.getAll.useQuery();
    const [formOpen, setFormOpen] = useState<boolean>(false)
    // const session = await auth();

    // <main> element is a semantic HTML5 element that represents the main content of a document.
    //     It is intended to contain the primary content of the page, excluding headers, footers, and sidebars.
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                    T3<span className="text-[hsl(280,100%,70%)]">TODO</span> App
                </h1>
                {/* Toggle Button */}
                <button
                    onClick={() => setFormOpen(!formOpen)}
                    className="rounded-full bg-blue-500 px-6 py-2 text-white font-semibold transition hover:bg-blue-600"
                >
                    {formOpen ? "Close Form" : "Add New Todo"}
                </button>
                {/* Conditionally Render CreateForm */}
                {formOpen && <CreateForm />}
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                        <TodoList todos={todos ?? []} />
                    </div>
                )}
            </div>
        </main>
    );
}
