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
import { CopyIcon, X, BookOpenIcon } from "lucide-react";
import Image from "next/image";
import { Loader } from "@/components/ai-elements/loader";

const models = [
  {
    name: "Gemini 2.5 Flash Lite",
    value: "gemini-2.5-flash-lite",
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
  const [isHovered, setIsHovered] = useState(false);

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
      {!isOpen && (
        <div
          className='fixed bottom-6 right-6 z-50'
          style={{ minWidth: 80, minHeight: 80 }}
        >
          <div
            className='relative flex items-center'
            style={{ minWidth: 80, minHeight: 80 }}
          >
            <button
              onClick={() => setIsOpen(true)}
              className='rounded-full p-0 shadow-2xl transition-all duration-300 hover:scale-110 bg-transparent border-none relative'
              aria-label='Abrir chat de ayuda'
              style={{ width: 80, height: 80 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className='absolute inset-0 w-full h-full rounded-full overflow-hidden'>
                <Image
                  src='/logo-chatbot.png'
                  alt='Chatbot'
                  fill
                  className='object-cover w-full h-full rounded-full'
                  priority
                />
              </span>
            </button>
            {/* Mensaje tipo diálogo encima del icono */}
            <span
              className={`pointer-events-none select-none transition-all duration-300 whitespace-nowrap text-base font-medium bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg absolute left-1/2 -translate-x-[70%] bottom-[90px] ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ minWidth: 120 }}
            >
              ¿Necesitas ayuda?
            </span>
          </div>
        </div>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className='fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[420px] h-[85vh] sm:h-[650px] sm:max-h-[85vh] bg-white sm:rounded-lg shadow-2xl flex flex-col overflow-hidden border-t sm:border border-gray-200'>
          {/* Header */}
          <div className='bg-blue-600 text-white p-4 flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <Image
                src='/logo-chatbot.png'
                alt='Chatbot'
                width={28}
                height={28}
                className='w-7 h-7 rounded-full bg-white'
                priority
              />
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
                <li>• Ubicación de la clínica</li>
                <li>• Información de servicios</li>
                <li>• Proceso para agendar citas</li>
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
              <PromptInput
                onSubmit={handleSubmit}
                className='!bg-white'
              >
                <PromptInputBody>
                  <PromptInputTextarea
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    placeholder='Escribe tu pregunta...'
                    className='text-sm !bg-white text-gray-900 placeholder:text-gray-500'
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
