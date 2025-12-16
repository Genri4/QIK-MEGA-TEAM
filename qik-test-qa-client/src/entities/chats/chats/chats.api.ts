import { buildFetcher, PaginationDTO } from "@shared";
import { ChatsDTO, MessagesDTO, SenderType } from "@/entities";

export const getChatsByChatList = buildFetcher<
  { chats: ChatsDTO[]; pagination: PaginationDTO.Response },
  { method: "GET"; query: PaginationDTO.Request }
>(`/chats/all`);

export const getChatById = buildFetcher<
  { chat: ChatsDTO },
  { method: "GET"; params: { id: string } }
>(`/chats/:id`);

export const createChat = buildFetcher<
  { chat: ChatsDTO },
  { method: "POST"; body: ChatsDTO.Create }
>(`/chats`);

export const updateChat = buildFetcher<
  { chat: ChatsDTO },
  { method: "PUT"; body: ChatsDTO.Update; params: { id: string } }
>(`/chats/:id`);

export const deleteChat = buildFetcher<
  {},
  { method: "DELETE"; params: { id: string } }
>(`/chats/:id`);
