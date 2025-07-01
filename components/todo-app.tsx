"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, ListTodo, Rocket, Trophy, Target, Coffee, CheckCircle, Sparkles } from "lucide-react"

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [celebratingId, setCelebratingId] = useState<number | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ziad-todos")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setTodos(parsed)
      } catch (error) {
        console.error("Failed to parse todos from localStorage:", error)
      }
    }
    // Trigger entrance animation
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  // Debounced localStorage save
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("ziad-todos", JSON.stringify(todos))
    }, 100)
    return () => clearTimeout(timeoutId)
  }, [todos])

  const addTodo = useCallback(() => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
      }
      setTodos((prev) => [todo, ...prev])
      setNewTodo("")
    }
  }, [newTodo])

  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id && !todo.completed) {
          // Trigger celebration animation
          setCelebratingId(id)
          setTimeout(() => setCelebratingId(null), 600)
        }
        return todo.id === id ? { ...todo, completed: !todo.completed } : todo
      }),
    )
  }, [])

  const deleteTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        addTodo()
      }
    },
    [addTodo],
  )

  // Memoized calculations
  const stats = useMemo(() => {
    const completedCount = todos.filter((todo) => todo.completed).length
    const totalCount = todos.length
    const pendingCount = totalCount - completedCount
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

    return {
      completedCount,
      totalCount,
      pendingCount,
      progressPercentage,
      isAllCompleted: completedCount === totalCount && totalCount > 0,
    }
  }, [todos])

  // Memoized progress bar color
  const progressBarColor = useMemo(() => {
    const progressPercentage = stats.progressPercentage
    if (progressPercentage === 100) {
      return "bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-400 dark:to-green-400"
    } else if (progressPercentage >= 75) {
      return "bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400"
    } else if (progressPercentage >= 50) {
      return "bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-amber-400 dark:to-yellow-400"
    } else if (progressPercentage >= 25) {
      return "bg-gradient-to-r from-orange-500 to-red-400 dark:from-orange-400 dark:to-red-400"
    } else {
      return "bg-gradient-to-r from-red-500 to-pink-500 dark:from-red-400 dark:to-pink-400"
    }
  }, [stats])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-4 transition-all duration-700">
      <div
        className={`mx-auto max-w-2xl w-full transform transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
      >
        {/* Header Section */}
        <header className="mb-8 text-center">
          <h1 className="mb-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-black dark:from-gray-100 dark:via-gray-200 dark:to-white bg-clip-text text-transparent animate-gradient-x">
            Todo List
          </h1>
          <p className="flex items-center justify-center gap-2 text-lg text-gray-700 dark:text-gray-300 transition-colors duration-500">
            <Rocket className="h-5 w-5 text-slate-500 dark:text-slate-400 hover:scale-110 transition-transform duration-300" />
            <span>Turn your tasks into achievements!</span>
            <Trophy className="h-5 w-5 text-slate-500 dark:text-slate-400 hover:scale-110 transition-transform duration-300" />
          </p>
        </header>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div className="transform hover:scale-105 transition-transform duration-200">
            <Badge variant="secondary" className="px-3 py-1 text-sm hover:shadow-md transition-shadow duration-200">
              <ListTodo className="w-4 h-4 mr-1" />
              {stats.totalCount} Total
            </Badge>
          </div>
          <div className="transform hover:scale-105 transition-transform duration-200">
            <Badge variant="default" className="px-3 py-1 text-sm hover:shadow-md transition-shadow duration-200">
              <Target className="w-4 h-4 mr-1" />
              {stats.completedCount} Completed
            </Badge>
          </div>
          <div className="transform hover:scale-105 transition-transform duration-200">
            <Badge variant="outline" className="px-3 py-1 text-sm hover:shadow-md transition-shadow duration-200">
              <Coffee className="w-4 h-4 mr-1" />
              {stats.pendingCount} Pending
            </Badge>
          </div>
        </div>

        {/* Main Todo Card */}
        <Card className="bg-white/95 dark:bg-slate-800/95 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
          <CardHeader className="text-center p-6">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-900 dark:text-gray-100">
              <Sparkles className="h-6 w-6 text-slate-500 dark:text-slate-400 animate-pulse" />
              <span>Your Awesome Tasks</span>
              <Sparkles className="h-6 w-6 text-slate-500 dark:text-slate-400 animate-pulse" />
            </CardTitle>
            <div
              className={`flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 transition-all duration-300 ${stats.isAllCompleted ? "scale-110" : "scale-100"}`}
            >
              <Target className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span>
                {stats.completedCount} of {stats.totalCount} completed
              </span>
              {stats.isAllCompleted && <span className="text-2xl animate-bounce">🎉</span>}
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {/* Add New Todo Input */}
            <div className="flex gap-3 w-full">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What awesome thing will you do?"
                className="flex-1 bg-slate-50 dark:bg-slate-700 text-gray-800 dark:text-gray-200 min-h-[44px] focus:scale-[1.02] transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                onKeyDown={handleKeyDown}
              />
              <Button
                onClick={addTodo}
                size="icon"
                className="bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-700 w-[44px] h-[44px] hover:scale-110 active:scale-95 transition-all duration-200 hover:shadow-lg"
              >
                <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              </Button>
            </div>

            {/* Progress Bar */}
            {stats.totalCount > 0 && (
              <div className="overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 h-3 shadow-inner">
                <div
                  className={`h-full ${progressBarColor} transition-all duration-700 ease-out shadow-sm`}
                  style={{
                    width: `${stats.progressPercentage}%`,
                    backgroundSize: "200% 100%",
                    animation: stats.progressPercentage > 0 ? "gradient-shift 3s ease-in-out infinite" : "none",
                  }}
                />
              </div>
            )}

            <Separator className="dark:bg-slate-600" />

            {/* Todo List */}
            <div
              className="space-y-3 overflow-y-auto"
              style={{
                maxHeight: stats.totalCount > 4 ? "384px" : "auto",
              }}
            >
              {todos.map((todo, index) => (
                <div
                  key={todo.id}
                  className={`group flex items-center gap-3 rounded-xl border p-4 transform transition-all duration-300 hover:scale-[1.02] ${
                    todo.completed
                      ? "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 opacity-75"
                      : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg"
                  } ${celebratingId === todo.id ? "animate-pulse scale-105" : ""}`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: isLoaded ? `slideInUp 0.5s ease-out ${index * 50}ms both` : "none",
                  }}
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="flex-shrink-0 hover:scale-110 transition-transform duration-200"
                  />

                  <span
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex flex-1 items-center gap-2 cursor-pointer text-base break-words transition-all duration-300 ${
                      todo.completed
                        ? "text-gray-500 dark:text-gray-400 line-through"
                        : "text-gray-800 dark:text-gray-200 hover:text-slate-600 dark:hover:text-slate-300"
                    }`}
                  >
                    {todo.text}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400 flex-shrink-0 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-110 transition-all duration-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {stats.totalCount === 0 && (
              <div className="py-12 text-center text-gray-600 dark:text-gray-400 animate-fade-in">
                <CheckCircle className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4 hover:scale-110 transition-transform duration-300" />
                <p className="text-lg text-gray-800 dark:text-gray-200 font-semibold mb-2">No tasks yet!</p>
                <p className="flex items-center justify-center gap-1 text-sm">
                  <span>Add your first task above</span>
                  <ListTodo className="h-4 w-4" />
                </p>
              </div>
            )}

            {/* Completion Celebration */}
            {stats.isAllCompleted && (
              <div className="py-6 text-center animate-celebration">
                <div className="mb-2 text-4xl animate-bounce">🎉</div>
                <p className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  <Trophy className="w-5 h-5 text-slate-500 dark:text-slate-400 animate-pulse" />
                  <span>Amazing! You completed everything!</span>
                  <Rocket className="w-5 h-5 text-slate-500 dark:text-slate-400 animate-pulse" />
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Simple Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300">
            Made by <span className="font-semibold text-gray-800 dark:text-gray-200">Ziad Hussein</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes celebration {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-celebration {
          animation: celebration 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
