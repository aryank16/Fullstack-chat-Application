import { createFileRoute } from '@tanstack/react-router'
import { ChatProvider } from '../contexts/ChatContext'
import Layout from '../components/Layout'

export const Route = createFileRoute('/chats')({
  component: ChatsPage,
})

function ChatsPage() {
  return (
    <ChatProvider>
      <Layout />
    </ChatProvider>
  )
}
