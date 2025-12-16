export type ChatsDTO = {
  id: string;
  title: string;
  createdAt: Date;
};

export namespace ChatsDTO {
  export type Create = Omit<ChatsDTO, "id" | "createdAt">;
  export type Update = Partial<Omit<ChatsDTO, "id" | "createdAt">>;
}
