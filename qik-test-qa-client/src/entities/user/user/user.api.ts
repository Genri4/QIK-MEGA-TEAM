import { buildFetcher, PaginationDTO } from '@shared'

import { UserDTO } from './user.dto'

export const getUsersList = buildFetcher<
  { users: UserDTO[]; pagination: PaginationDTO.Response },
  { method: 'GET'; query: PaginationDTO.Request }
>(`/users/all`)

export const getUserById = buildFetcher<
  { user: UserDTO },
  { method: 'GET'; params: { userId: string } }
>(`/users/:userId`)

export const getAuthorizedUser = buildFetcher<{ user: UserDTO }, { method: 'GET' }>(
  `/users/authorized`
)

export const updateAuthorizedUser = buildFetcher<
  { user: UserDTO },
  { method: 'PUT'; body: UserDTO.Update }
>(`/users/authorized`)

export const updateUserById = buildFetcher<
  { user: UserDTO },
  { method: 'PATCH'; params: { userId: string }; body: UserDTO.Update }
>(`/users/:userId`)

// auth

export const registerUser = buildFetcher<
  { user: UserDTO },
  { method: 'POST'; body: UserDTO.Register }
>(`/auth/register`)

export const loginUser = buildFetcher<{ user: UserDTO }, { method: 'POST'; body: UserDTO.Login }>(
  `/auth/login`
)

export const refreshUser = buildFetcher<{}, { method: 'PUT' }>(`/auth/refresh`)

export const logoutUser = buildFetcher<{}, { method: 'DELETE' }>(`/auth/logout`)
