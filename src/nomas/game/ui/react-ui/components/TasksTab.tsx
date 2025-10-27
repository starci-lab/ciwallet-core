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
      window.open("https://t.me/your-community", "_blank")
    },
  },
  {
    id: "community-2",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      window.open("https://discord.gg/your-discord", "_blank")
    },
  },
  {
    id: "community-3",
    title: "Join Our Community",
    reward: 100000,
    icon: "💬",
    completed: false,
    action: () => {
      window.open("https://twitter.com/your-twitter", "_blank")
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
    <div className="p-4 space-y-3">
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={task.action}
          disabled={task.completed}
          className={`w-full bg-[#2a2a2a] rounded-2xl p-4 flex items-center justify-between transition-all ${
            task.completed ? "opacity-60" : "hover:bg-[#333] active:scale-98"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-2xl">
              {task.icon}
            </div>
            <div className="text-left">
              <h3 className="text-base font-semibold text-white mb-1">
                {task.title}
              </h3>
              <div className="flex items-center gap-1">
                <span className="text-sm text-white font-semibold">
                  +{task.reward.toLocaleString()}
                </span>
                <NomasImage
                  src={assets.nomasCoin}
                  alt="NOM"
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>
          <div className="text-2xl">{task.completed ? "✅" : "›"}</div>
        </button>
      ))}
    </div>
  )
}
