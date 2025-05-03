import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ClipboardList } from "lucide-react"

// This would be replaced with your actual data fetching logic in T3 stack
const mockTodos = [
    {
        id: 1,
        title: "Learn T3 Stack",
        description: "Study the core concepts of T3 Stack",
        completed: false,
        priority: "high",
    },
    {
        id: 2,
        title: "Build Todo App",
        description: "Implement the todo application with proper state management",
        completed: true,
        priority: "medium",
    },
    {
        id: 3,
        title: "Add Authentication",
        description: "Implement user authentication with NextAuth.js",
        completed: false,
        priority: "low",
    },
]

export default function Home() {
    // In a real app, you would fetch todos from your API/database
    const todos = mockTodos

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-10">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">My Todos</h1>
                    <Badge variant="outline" className="text-sm">
                        {todos.length} {todos.length === 1 ? "item" : "items"}
                    </Badge>
                </div>

                {todos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                        <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-xl font-medium">No todos yet</h3>
                        <p className="mb-6 text-muted-foreground">Create your first todo item to get started</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {todos.map((todo) => (
                            <Card key={todo.id} className="overflow-hidden">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <Checkbox id={`todo-${todo.id}`} checked={todo.completed} />
                                                <span className={todo.completed ? "line-through text-muted-foreground" : ""}>{todo.title}</span>
                                            </CardTitle>
                                        </div>
                                        <Badge
                                            variant={
                                                todo.priority === "high" ? "destructive" : todo.priority === "medium" ? "default" : "secondary"
                                            }
                                        >
                                            {todo.priority}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className={`text-sm ${todo.completed ? "text-muted-foreground" : ""}`}>{todo.description}</p>
                                </CardContent>
                                <CardFooter className="border-t bg-muted/50 px-6 py-3">
                                    <p className="text-xs text-muted-foreground">Created on {new Date().toLocaleDateString()}</p>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
