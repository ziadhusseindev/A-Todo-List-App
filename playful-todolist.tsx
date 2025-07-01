"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, CheckCircle2, Circle, Sparkles, Target, Coffee, Zap, Star, Trophy, Rocket } from "lucide-react"

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
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

const celebrationVariants = {
  initial: { scale: 1 },
  celebrate: {
    scale: [1, 1.2, 1],
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
}

export default function Component() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Build something awesome", completed: false, createdAt: new Date() },
    { id: 2, text: "Take a coffee break", completed: true, createdAt: new Date() },
    { id: 3, text: "Celebrate small wins", completed: false, createdAt: new Date() },
  ])
  const [newTodo, setNewTodo] = useState("")
  const [celebratingId, setCelebratingId] = useState<number | null>(null)

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
      }
      setTodos([todo, ...todos])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          if (!todo.completed) {
            setCelebratingId(id)
            setTimeout(() => setCelebratingId(null), 600)
          }
          return { ...todo, completed: !todo.completed }
        }
        return todo
      }),
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length

  const getRandomIcon = () => {
    const icons = [Target, Coffee, Zap, Star, Sparkles]
    const IconComponent = icons[Math.floor(Math.random() * icons.length)]
    return <IconComponent className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <motion.div className="max-w-2xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="inline-block"
            >
              ✨
            </motion.span>{" "}
            Todo Magic{" "}
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
              className="inline-block"
            >
              ✨
            </motion.span>
          </motion.h1>
          <motion.p className="text-gray-600 text-lg flex items-center justify-center gap-2" variants={itemVariants}>
            <Rocket className="w-5 h-5" />
            Turn your tasks into achievements!
            <Trophy className="w-5 h-5" />
          </motion.p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-purple-100/50">
            <CardHeader className="text-center">
              <CardTitle className="text-gray-800 text-2xl flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-purple-500" />
                </motion.div>
                Your Awesome Tasks
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </motion.div>
              </CardTitle>
              <motion.div
                className="text-gray-600 flex items-center justify-center gap-2"
                key={`${completedCount}-${totalCount}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Target className="w-4 h-4" />
                {completedCount} of {totalCount} completed
                {completedCount === totalCount && totalCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">
                    🎉
                  </motion.span>
                )}
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new todo */}
              <motion.div className="flex gap-2" variants={itemVariants}>
                <Input
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What awesome thing will you do? ✨"
                  className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:bg-white focus:border-purple-300 transition-all duration-300"
                  onKeyPress={(e) => e.key === "Enter" && addTodo()}
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={addTodo}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Progress bar */}
              {totalCount > 0 && (
                <motion.div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden" variants={itemVariants}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </motion.div>
              )}

              {/* Todo list */}
              <motion.div className="space-y-3 max-h-96 overflow-y-auto" variants={containerVariants}>
                <AnimatePresence>
                  {todos.map((todo) => (
                    <motion.div
                      key={todo.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className={`group flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                        todo.completed
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 border border-gray-200 hover:bg-white hover:shadow-md"
                      }`}
                    >
                      <motion.button
                        onClick={() => toggleTodo(todo.id)}
                        className={`transition-all duration-300 ${
                          todo.completed ? "text-green-500" : "text-gray-400 hover:text-purple-500"
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        variants={celebratingId === todo.id ? celebrationVariants : {}}
                        initial="initial"
                        animate={celebratingId === todo.id ? "celebrate" : "initial"}
                      >
                        {todo.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                      </motion.button>

                      <motion.span
                        className={`flex-1 transition-all duration-300 flex items-center gap-2 ${
                          todo.completed ? "text-gray-500 line-through" : "text-gray-800"
                        }`}
                        layout
                      >
                        {getRandomIcon()}
                        {todo.text}
                      </motion.span>

                      <motion.button
                        onClick={() => deleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {todos.length === 0 && (
                <motion.div
                  className="text-center py-12 text-gray-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    🌟
                  </motion.div>
                  <p className="text-lg font-medium">No tasks yet!</p>
                  <p className="text-sm flex items-center justify-center gap-1">
                    Add your first awesome task above
                    <Sparkles className="w-4 h-4" />
                  </p>
                </motion.div>
              )}

              {completedCount === totalCount && totalCount > 0 && (
                <motion.div
                  className="text-center py-6"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <motion.div
                    className="text-4xl mb-2"
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
                  <p className="text-gray-700 font-semibold text-lg flex items-center justify-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Amazing! You completed everything!
                    <Rocket className="w-5 h-5 text-blue-500" />
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="text-center mt-8 text-gray-500 text-sm flex items-center justify-center gap-1"
          variants={itemVariants}
        >
          Made with ❤️ and a lot of
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="inline-block"
          >
            ✨
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  )
}
