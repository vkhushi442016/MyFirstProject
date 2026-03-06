import { create } from 'zustand';
import { persist } from 'zustand/middleware'

let useStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            login: (username, token) => set({
                user: username,
                token: token
            }),
            logout: () => set({
                user: null,
                token: null
            })
        }),
        {
            name: "userdata"
        }
    )
)



export default useStore;
