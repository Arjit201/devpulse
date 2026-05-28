import {useMutation,useQueryClient,useQuery} from '@tanstack/react-query'
import {useNavigate} from 'react-router-dom'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export function useMe(){
    const token = useAuthStore((s)=>s.accessToken)
    return useQuery({
        queryKey : ['me'],
        queryFn : async()=>{
            const {data} = await api.get('/auth/me')
            return data
        },
        enabled = !!token,
        staleTime: 1000*60*5,
    })
}
export function useLogin(){
    const {login} = useAuthStore()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async(credentials)=>{
            const {data} = await api.post('/auth/login',credentials)
            return data
        },
        onSucess:(data)=>{
            login(data.accessToken,data.user)
            queryClient.invalidateQueries({queryKey:['me']})
        },
    })
}
export function useRegister(){
    const {login} = useAuthStore()
    return useMutation({
        mutationFn:async(payload)=>{
            const {data} = await api.post('/auth/register',payload)
            return data
        },
        onSuccess: (data)=>{
            login(data.accessToken,data.user)
        }
    })
}
export function useLogout(){
    const {logout} = useAuthStore()
    const queryClien = useQueryClient()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: ()=>api.post('/auth/logout'),
        onSettled:()=>{
            logout()
            queryClient.clear()
            navigate('/login')
        },
    })
}