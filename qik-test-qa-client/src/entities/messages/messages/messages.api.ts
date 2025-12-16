import { buildFetcher, PaginationDTO } from "@shared";
import { MessagesDTO, SenderType } from "@/entities";

export const getMessagesByChatList = buildFetcher<
  { messages: MessagesDTO[]; pagination: PaginationDTO.Response },
  { method: "GET"; query: PaginationDTO.Request; params: { chatId: string } }
>(`/messages/:chatId/all`);

export const getMessagesByChatAndSenderList = buildFetcher<
  {
    messages: MessagesDTO[];
    pagination: PaginationDTO.Response;
  },
  {
    method: "GET";
    query: PaginationDTO.Request & { sender: SenderType };
    params: { chatsId: string };
  }
>(`/messages/sender/:chatId/all`);

export const getMessageById = buildFetcher<
  { message: MessagesDTO },
  { method: "GET"; params: { id: string } }
>(`/messages/:id`);

export const createMessage = buildFetcher<
  { message: MessagesDTO },
  { method: "POST"; body: MessagesDTO.Create; params: { chatId: string } }
>(`/messages/:chatId`);

export const updateMessage = buildFetcher<
  { message: MessagesDTO },
  { method: "PUT"; body: MessagesDTO.Update; params: { id: string } }
>(`/messages/:id`);

export const deleteMessage = buildFetcher<
  {},
  { method: "DELETE"; params: { id: string } }
>(`/messages/:id`);
