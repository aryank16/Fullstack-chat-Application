import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="bg-white text-black min-h-screen flex items-center justify-center">
      Hello, World!
    </div>
  )
}
