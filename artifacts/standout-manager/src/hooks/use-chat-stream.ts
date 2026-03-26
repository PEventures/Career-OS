import { useState } from "react";
import { getToken } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export function useChatStream(conversationId: string) {
  const [messages, setMessages] = useState<Array<{role: string, content: string, id: string}>>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const sendMessage = async (content: string, toneMode?: string) => {
    if (!content.trim() || isStreaming) return;

    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, role: "user", content }]);

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantMsgId, role: "assistant", content: "" }]);

    setIsStreaming(true);
    setError(null);

    try {
      const response = await fetch(`/api/openai/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ content, toneMode }),
      });

      if (!response.ok) {
        // Read the actual error message from the body instead of a generic string
        let errorMessage = "Failed to send message";
        try {
          const errData = await response.json();
          errorMessage = errData.message || errData.error || errorMessage;
        } catch {
          // ignore parse error, use default
        }
        throw new Error(errorMessage);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));

          for (const line of lines) {
            const dataStr = line.replace('data: ', '').trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);

              if (data.error) {
                // Backend sent an error inside the stream
                setMessages(prev => prev.filter(msg => msg.id !== assistantMsgId));
                setError(data.error);
                done = true;
                break;
              }

              if (data.done) {
                done = true;
                break;
              }

              if (data.content) {
                setMessages(prev => prev.map(msg =>
                  msg.id === assistantMsgId
                    ? { ...msg, content: msg.content + data.content }
                    : msg
                ));
              }
            } catch (e) {
              console.error("Error parsing SSE JSON:", e);
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      setMessages(prev => prev.filter(msg => msg.id !== assistantMsgId));
    } finally {
      setIsStreaming(false);
      queryClient.invalidateQueries({ queryKey: [`/api/openai/conversations/${conversationId}`] });
    }
  };

  return { messages, setMessages, sendMessage, isStreaming, error };
}
