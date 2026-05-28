import {useQuery,useQueryClient,useMutation} from '@tanstack/react-query'
import api from '@/lib/api'

export function useJobs(filters={}){
    return useQuery({
        query:['jobs',filters],
        queryFn:async ()=>{
            const {data} = await api.get('/jobs',{params:filters})
            return data
        },
        staleTime: 1000*30,
    })
}
export function useJob(id){
    return useQuery({
        query:['jobs',id],
        queryFn:async ()=>{
            const {data} = await api.get(`/jobs/${id}`)
            return data        },
        enable = !!id,
    })
}
export function useJobApplications(jobid){
    return useQuery({
        query:['jobs',jobId,'applications'],
        queryFn:async()=>{
            const {data} = await api.get(`/jobs/${jobId}/applications`)
            return data
        },
        enabled: !!jobId
    })
}
export function useCreateJob(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(payload)=>api.post('/jobs',payload).then((r)=>r.data),
        onSuccess:()=>queryClient.invalidateQueries({queryKey:['jobs']}),
    })
}
export function useUpdateJob(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:({id,...payload})=>
            api.patch(`/jobs/${id}`,payload).then((r)=>r.data),
        onSuccess:(_,{id})=>{
            queryClient.invalidateQueries({queryKey:['jobs']})
            queryClient.invalidateQueries({queryKey:['jobs',id]})
        },
    })
}