export enum UserTheme {
  dark = "dark",
  light = "light",
}

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  theme: UserTheme;
  gitHubId?: string;
  lastSentAt: Date;
  createdAt: Date;
};

export namespace UserDTO {
  export type Login = Pick<UserDTO, "email"> & { password: string };
  export type Register = Pick<UserDTO, "name" | "email"> & { password: string };
  export type Update = Partial<Omit<UserDTO, "id" | "createdAt">>;
}
