"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
  exit: {
    x: -100,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

const floatingIconVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ziad-todos")
    if (saved) {
      const parsed = JSON.parse(saved)
      setTodos(parsed)
    }
  }, [])

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("ziad-todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([{ id: Date.now(), text: newTodo.trim(), completed: false }, ...todos])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const completedCount = todos.filter((todo) => todo.completed).length
  const pendingCount = todos.length - completedCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-2 sm:p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Floating Background Icons */}
      <motion.div
        className="absolute top-20 left-10 text-slate-200 opacity-30"
        variants={floatingIconVariants}
        animate="animate"
      >
        <Rocket className="w-8 h-8" />
      </motion.div>
      <motion.div
        className="absolute top-40 right-20 text-slate-300 opacity-30"
        variants={floatingIconVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <CheckCircle className="w-6 h-6" />
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-20 text-slate-200 opacity-30"
        variants={floatingIconVariants}
        animate="animate"
        transition={{ delay: 2 }}
      >
        <Sparkles className="w-7 h-7" />
      </motion.div>
      <motion.div
        className="absolute top-60 right-10 text-slate-300 opacity-30"
        variants={floatingIconVariants}
        animate="animate"
        transition={{ delay: 0.5 }}
      >
        <Trophy className="w-5 h-5" />
      </motion.div>

      <motion.div
        className="mx-auto max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl relative z-10 w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.header className="mb-8 text-center" variants={itemVariants}>
          <motion.h1
            className="mb-4 bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-4xl font-bold text-transparent md:text-6xl"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {" "}
            Todo List{" "}
            
          </motion.h1>
          <motion.p className="flex items-center justify-center gap-2 text-lg text-gray-700" variants={itemVariants}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
              <Rocket className="h-5 w-5 text-slate-500" />
            </motion.div>
            Turn your tasks into achievements!
            <Trophy className="h-5 w-5 text-slate-500" />
          </motion.p>
        </motion.header>

        {/* Stats */}
        <motion.div className="flex justify-center gap-4 mb-6" variants={itemVariants}>
          <Badge variant="secondary" className="px-3 py-1 bg-slate-100 text-gray-800 border-slate-200">
            <ListTodo className="w-4 h-4 mr-1" />
            {todos.length} Total
          </Badge>
          <Badge variant="default" className="px-3 py-1 bg-slate-500 hover:bg-slate-600">
            <Target className="w-4 h-4 mr-1" />
            {completedCount} Completed
          </Badge>
          <Badge variant="outline" className="px-3 py-1 border-slate-300 text-gray-700">
            <Coffee className="w-4 h-4 mr-1" />
            {pendingCount} Pending
          </Badge>
        </motion.div>

        {/* Main Todo Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 bg-white/90 shadow-2xl shadow-slate-100/50 backdrop-blur-sm w-full">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-900">
                <ListTodo className="h-6 w-6 text-slate-500" />
                Your Awesome Tasks
                <Sparkles className="h-6 w-6 text-slate-500" />
              </CardTitle>
              <motion.div
                className="flex items-center justify-center gap-2 text-gray-600"
                key={`${completedCount}-${todos.length}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Target className="h-4 w-4 text-slate-500" />
                {completedCount} of {todos.length} completed
                {completedCount === todos.length && todos.length > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">
                    🎉
                  </motion.span>
                )}
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Add New Todo Input */}
              <motion.div className="flex flex-col sm:flex-row gap-3 w-full" variants={itemVariants}>
                <Input
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What awesome thing will you do? "
                  className="flex-1 border-0 bg-slate-50 text-gray-800 placeholder:text-gray-500 focus:border-0 focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all duration-300 shadow-sm min-h-[44px] w-full font-medium"
                  onKeyDown={(e) => e.key === "Enter" && addTodo()}
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
                  <Button
                    onClick={addTodo}
                    size="icon"
                    className="bg-gradient-to-r from-slate-500 to-slate-600 shadow-lg transition-all duration-300 hover:from-slate-600 hover:to-slate-700 hover:shadow-xl w-[44px] h-[44px]"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Progress Bar */}
              {todos.length > 0 && (
                <motion.div className="overflow-hidden rounded-full bg-slate-200 h-3" variants={itemVariants}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-gray-500 to-gray-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / todos.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </motion.div>
              )}

              <Separator />

              {/* Todo List */}
              <motion.div className="max-h-96 space-y-3 overflow-y-auto" variants={containerVariants}>
                <AnimatePresence mode="popLayout">
                  {todos.map((todo) => (
                    <motion.div
                      key={todo.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className={`group flex items-center gap-3 rounded-xl border p-4 transition-all duration-300 ${
                        todo.completed
                          ? "border-slate-200 bg-slate-50"
                          : "border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md"
                      }`}
                    >
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="data-[state=checked]:bg-slate-500 data-[state=checked]:border-slate-500"
                      />

                      <motion.span
                        onClick={() => toggleTodo(todo.id)}
                        className={`flex flex-1 items-center gap-2 transition-all duration-300 cursor-pointer ${
                          todo.completed ? "text-gray-500 line-through" : "text-gray-800"
                        }`}
                        layout
                      >
                        {todo.text}
                      </motion.span>

                      <motion.button
                        onClick={() => deleteTodo(todo.id)}
                        className="opacity-0 text-red-400 transition-all duration-300 group-hover:opacity-100 hover:text-red-500"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Empty State */}
              {todos.length === 0 && (
                <motion.div
                  className="py-12 text-center text-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="mb-4"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <CheckCircle className="w-16 h-16 text-slate-400 mx-auto" />
                  </motion.div>
                  <p className="text-lg text-gray-800 font-semibold">No tasks yet!</p>
                  <p className="flex items-center justify-center gap-1 text-sm">
                    Add your first task above
                    <ListTodo className="h-4 w-4" />
                  </p>
                </motion.div>
              )}

              {/* Completion Celebration */}
              {todos.length > 0 && completedCount === todos.length && (
                <motion.div
                  className="py-6 text-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <motion.div
                    className="mb-2 text-4xl"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    🎉
                  </motion.div>
                  <p className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-800">
                    <Trophy className="w-5 h-5 text-slate-500" />
                    Amazing! You completed everything!
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Rocket className="w-5 h-5 text-slate-500" />
                    </motion.div>
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Simple Footer */}
        <motion.div className="mt-8 text-center" variants={itemVariants}>
          <p className="text-gray-600 text-sm">
            Made by <span className="font-semibold text-gray-800">Ziad Hussein</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
