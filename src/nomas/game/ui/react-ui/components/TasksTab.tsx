/* eslint-disable indent */
import { NomasImage } from "@/nomas/components"
import { assetsConfig } from "@/nomas/resources"

interface Task {
  id: string
  title: string
  reward: number
  icon: string
  completed: boolean
  action?: () => void
}

const tasks: Task[] = [
  {
    id: "community-1",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      console.log("Join Our Community")
    },
  },
  {
    id: "community-2",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      console.log("Join Our Community")
    },
  },
  {
    id: "community-3",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      console.log("Join Our Community")
    },
  },
  {
    id: "channel",
    title: "Follow Our Channel",
    reward: 100000,
    icon: "📢",
    completed: true,
  },
  {
    id: "community-1",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      console.log("Join Our Community")
    },
  },
  {
    id: "community-2",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      console.log("Join Our Community")
    },
  },
  {
    id: "community-3",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      console.log("Join Our Community")
    },
  },
  {
    id: "channel",
    title: "Follow Our Channel",
    reward: 100000,
    icon: "📢",
    completed: true,
  },
  {
    id: "community-1",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      console.log("Join Our Community")
    },
  },
  {
    id: "community-2",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      console.log("Join Our Community")
    },
  },
  {
    id: "community-3",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      console.log("Join Our Community")
    },
  },
  {
    id: "channel",
    title: "Follow Our Channel",
    reward: 100000,
    icon: "📢",
    completed: true,
  },
  {
    id: "community-1",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      console.log("Join Our Community")
    },
  },
  {
    id: "community-2",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      console.log("Join Our Community")
    },
  },
  {
    id: "community-3",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      console.log("Join Our Community")
    },
  },
  {
    id: "channel",
    title: "Follow Our Channel",
    reward: 100000,
    icon: "📢",
    completed: true,
  },
  {
    id: "community-1",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      console.log("Join Our Community")
    },
  },
  {
    id: "community-2",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      console.log("Join Our Community")
    },
  },
  {
    id: "community-3",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      console.log("Join Our Community")
    },
  },
  {
    id: "channel",
    title: "Follow Our Channel",
    reward: 100000,
    icon: "📢",
    completed: true,
  },
]

export function TasksTab() {
  const assets = assetsConfig().game

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 space-y-2">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={task.action}
            disabled={task.completed}
            className={`w-full bg-card-dark-4 rounded-lg p-2.5 flex items-center justify-between transition-all ${
              task.completed ? "opacity-60" : "hover:bg-card-dark-6 active:scale-98"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-card-dark-3 rounded-lg flex items-center justify-center text-lg">
                {task.icon}
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-white mb-0.5">
                  {task.title}
                </h3>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-white font-semibold">
                    +{task.reward.toLocaleString()}
                  </span>
                  <NomasImage
                    src={assets.nomasCoin}
                    alt="NOM"
                    className="w-3 h-3"
                  />
                </div>
              </div>
            </div>
            <div className="text-lg">{task.completed ? "✅" : "›"}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
