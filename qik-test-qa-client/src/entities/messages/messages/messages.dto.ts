export enum SenderType {
  USER = 'user',
  SENDER = 'sender',
}

export type MessagesDTO = {
  id: string;
  content: string;
  sender: SenderType
  createdAt: Date;
}

export namespace MessagesDTO {
  export type Create = Omit<MessagesDTO, 'id' | 'createdAt'>
  export type Update = Partial<Omit<MessagesDTO, 'id' | 'createdAt'>>
}