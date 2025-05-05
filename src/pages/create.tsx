import { useState } from 'react';
import { trpc } from '../utils/trpc'; // Your tRPC client setup

export default function CreateTodo() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const createTodo = trpc.todo.create.useMutation();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTodo.mutateAsync({ title, description });
            alert('Todo created successfully!');
        } catch (error) {
            console.error('Error creating todo:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Todo</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Create Todo
                </button>
            </form>
        </div>
    );
}