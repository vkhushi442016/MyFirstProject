import { create } from 'zustand';
import { persist } from 'zustand/middleware'

let useStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            role: null,
            staff_id: null,
            dise_code: null,
            sc_category: null,
            notifications: [],
            unread: 0,

            login: (data) => set({
                user: data.username || data.email,
                token: data.token || null,
                role: data.role || data.roles?.[0],
                staff_id: data.staff_id,
                dise_code: data.dise_code || null,
                sc_category: data.sc_category || null
            }),
            logout: () => set({
                user: null,
                token: null,
                role: null,
                staff_id: null,
                dise_code: null,
                sc_category: null,
            }),

            // 🔔 Notification actions
            addNotification: (data) =>
                set((state) => ({
                    notifications: [data, ...state.notifications],
                    unread: state.unread + 1,
                })),

            clearUnread: () => set({ unread: 0 }),

            clearNotifications: () => set({ notifications: [] }),
        }),

        {
            name: "userdata"
        }
    )
)



export default useStore;
