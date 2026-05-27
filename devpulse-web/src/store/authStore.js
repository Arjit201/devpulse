import {create} from 'zustand'
import {persist} from 'zustand/middleware'

export const useAuthStore = create(
    persist(
        (set)=>({
            accesstoken:null,
            user:null,
            
            setAccessToken:(token)=>set({accessToken:token}),
            setUser : (user)=>set({user}),

            login:(token,user)=>set({accessToken:token,user}),
            logout:()=>set({accessToken:null,user:null})

        }),
        {
            name:'devpulse-auth',
            partialize:(state)=>({user:state.user}),
        }
    )
)