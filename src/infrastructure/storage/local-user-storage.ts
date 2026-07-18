import type { UserProfile } from '@/domain/entities/user-profile.entity'

const USER_KEY = 'current_user'

export const localUserStorage = {
  saveUser(user: UserProfile) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user),
    )
  },

  getUser(): UserProfile | null {
    const user = localStorage.getItem(USER_KEY)

    if (!user) return null

    return JSON.parse(user)
  },

  clearUser() {
    localStorage.removeItem(USER_KEY)
  },
}