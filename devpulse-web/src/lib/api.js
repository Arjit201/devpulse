import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
    baseURL:'/api/v1',
    headers:{'Content-Type':'application/json'},
})

//attach access tokens to each request
api.interceptors.request.use((config)=>{
    const token = useAuthStore.getState().accessToken
    if(token)config.headers.Authorization = `Bearer ${token}`
    return config 
})

//refresh and retry on 401
let isRefreshing = false
let failedQueue = []

const processQueue = (error,token=null)=>{
    failedQueue.forEach((p)=>error?p.reject(error):p.resolve(token))
    failedQueue = []
}

api.interceptors.response.use(
    (res)=>res,
    async(error)=>{
        const original = error.config
        if(error.response?.status === 401 && !original._retry){
            if(isRefreshing){
                return new Promise((resolve,reject)=>{
                    failedQueue.push({resolve,reject})
                }).then((token)=>{
                    original.headers.Authorization = `Bearer ${token}`
                    return api(original)
                })
            }
            original_retry = true
            isRefreshing = true
            try{
                const{data} = await axios.post(
                    '/api/v1/auth/refresh',
                    {},
                    {withCredentials:true})
                const newToken = data.accessToken
                useAuthStore.getState().setAccessToken(newToken)
                processQueue(null,newToken)
                original.headers.Authorization = `Bearer ${newToken}`
                return api(original)
                }
                catch(err){
                    processQueue(err,null)
                    useAuthStore.getState().logout()
                    window.location.href = '/login'
                    return Promise.reject(err)
                }
                finally{
                    isRefreshing = false
                }
            }
            return Promise.reject(error)
        }
)
export default api