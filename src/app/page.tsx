import { ChatProvider } from "@/components/chat/ChatProvider";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { InputComposer } from "@/components/chat/InputComposer";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <ChatProvider>
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <ChatContainer className="flex-1 overflow-hidden" />
        <InputComposer />
      </div>
    </ChatProvider>
  );
}
