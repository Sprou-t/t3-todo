import { useState } from "react";
import { string } from "zod";

import { api } from "~/trpc/react";
// get title and description in its arguments and render it
interface TodoCardProps {
    title: string;
    description: string;
}

// export function TodoCard({ title, description }: { title: string; description: string }) {
export function TodoCard({ title, description }: TodoCardProps) {

    return (
        <div className="w-full max-w-xs rounded-lg bg-gray-800 p-4 shadow-lg transition hover:shadow-xl">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="mt-2 text-sm text-gray-300">{description}</p>
        </div>
    );
}
