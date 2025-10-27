"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Actions, Action } from "@/components/ai-elements/actions";
import { useState, Fragment } from "react";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { CopyIcon, MessageCircle, X, BookOpenIcon } from "lucide-react";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";

const models = [
  {
    name: "Gemini 2.0 Flash",
    value: "gemini-2.0-flash-exp",
  },
  {
    name: "Gemini 1.5 Pro",
    value: "gemini-1.5-pro-latest",
  },
  {
    name: "Gemini 1.5 Flash",
    value: "gemini-1.5-flash-latest",
  },
];

export const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [model] = useState<string>(models[0].value);
  const [useFAQ] = useState(true); // Siempre activado para usuarios públicos
  const { messages, sendMessage, status, error } = useChat({
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);

    if (!hasText) {
      return;
    }

    sendMessage(
      {
        text: message.text || "",
        files: message.files,
      },
      {
        body: {
          model: model,
          useFAQ: useFAQ, // Siempre usa FAQ para público
        },
      }
    );
    setInput("");
  };

  return (
    <>
      {/* Botón flotante - Más grande */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className='fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-5 shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-3 group'
          aria-label='Abrir chat de ayuda'
        >
          <MessageCircle className='w-8 h-8' />
          <span className='max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-base font-medium'>
            ¿Necesitas ayuda?
          </span>
        </button>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className='fixed bottom-6 right-6 z-50 w-[90vw] sm:w-96 h-[600px] max-h-[80vh] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200'>
          {/* Header */}
          <div className='bg-blue-600 text-white p-4 flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <MessageCircle className='w-5 h-5' />
              <div>
                <h3 className='font-semibold'>Asistente Virtual</h3>
                <p className='text-xs text-blue-100 flex items-center gap-1'>
                  <BookOpenIcon className='w-3 h-3' />
                  Base de conocimiento activa
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='hover:bg-blue-700 rounded-full p-1 transition-colors'
              aria-label='Cerrar chat'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Mensaje de bienvenida */}
          {messages.length === 0 && (
            <div className='p-4 bg-blue-50 border-b border-blue-100'>
              <p className='text-sm text-gray-700'>
                👋 ¡Hola! Soy tu asistente virtual. Puedo ayudarte con:
              </p>
              <ul className='text-xs text-gray-600 mt-2 space-y-1 ml-4'>
                <li>• Horarios de atención</li>
                <li>• Agendar citas</li>
                <li>• Información de servicios</li>
                <li>• Precios y seguros</li>
              </ul>
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className='p-4 m-4 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-sm text-red-700 font-medium'>
                ⚠️ {error.message}
              </p>
              <p className='text-xs text-red-600 mt-2'>
                💬 Llámanos:{" "}
                <a
                  href='tel:+51952864883'
                  className='underline font-medium'
                >
                  +51 952 864 883
                </a>
              </p>
            </div>
          )}

          {/* Área de conversación */}
          <div className='flex-1 flex flex-col overflow-hidden'>
            <Conversation className='flex-1'>
              <ConversationContent className='p-4'>
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <Fragment key={`${message.id}-${i}`}>
                              <Message from={message.role}>
                                <MessageContent>
                                  <Response>{part.text}</Response>
                                </MessageContent>
                              </Message>
                              {message.role === "assistant" &&
                                i === message.parts.length - 1 && (
                                  <Actions className='mt-2'>
                                    <Action
                                      onClick={() =>
                                        navigator.clipboard.writeText(part.text)
                                      }
                                      label='Copiar'
                                    >
                                      <CopyIcon className='size-3' />
                                    </Action>
                                  </Actions>
                                )}
                            </Fragment>
                          );
                        case "reasoning":
                          return (
                            <Reasoning
                              key={`${message.id}-${i}`}
                              className='w-full'
                              isStreaming={
                                status === "streaming" &&
                                i === message.parts.length - 1 &&
                                message.id === messages.at(-1)?.id
                              }
                            >
                              <ReasoningTrigger />
                              <ReasoningContent>{part.text}</ReasoningContent>
                            </Reasoning>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                ))}
                {status === "submitted" && <Loader />}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            {/* Input area */}
            <div className='border-t border-gray-200 p-3 bg-gray-50'>
              <PromptInput onSubmit={handleSubmit}>
                <PromptInputBody>
                  <PromptInputTextarea
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    placeholder='Escribe tu pregunta...'
                    className='text-sm'
                  />
                </PromptInputBody>
                <PromptInputToolbar>
                  <PromptInputTools>
                    <span className='text-xs text-gray-500 flex items-center gap-1'>
                      <BookOpenIcon className='w-3 h-3' />
                      FAQ
                    </span>
                  </PromptInputTools>
                  <PromptInputSubmit
                    disabled={!input}
                    status={status}
                  />
                </PromptInputToolbar>
              </PromptInput>
            </div>
          </div>

          {/* Footer */}
          <div className='p-2 bg-gray-100 text-center'>
            <p className='text-xs text-gray-500'>
              Asistente con IA • Información general
            </p>
          </div>
        </div>
      )}
    </>
  );
};
