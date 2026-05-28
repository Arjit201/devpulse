import {useQuery,useQueryClient,useMutations} from '@tanstack/react-query'
import api from '@/lib/api'

export function useMyApplication(){
    return useQuery({
        queryKey:['applications','mine'],
        queryFn:async()=>{
            const {data} = await api.get('/applications/mine')
            return data
        },
    })
}
export function useApplication(id){
    return useQuery({
        queryKey:['applications',id],
        queryFn:async()=>{
            const {data} = await api.get(`/applications/${id}`)
            return data
        },
        enabled : !!id
    })
}
export function useApplicationTimeline(id){
    return useQuery({
        queryKey:['applications',id,'timeline'],
        queryFn: async()=>{
            const {data}  = await api.get(`applications/${id}/timeline`)
            return data
        },
        enabled : !!id
    })
}
export function useApply(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(formData)=>
            api.post('/applications',formData,{
                headers:{'Content-Type':'multipart/form-data'},
            }).then((r)=>r.data),
        onSuccess:()=>
            queryClient.invalidateQueries({queryKey:['applications','mine']}),
    })
}

export function useAdvanceStage(jobId){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:({applicationId,stage,note})=>
            api.patch(`/applications/${applicationId}/stage`,{stage,note}).then((r)=>r.data),
        onMutate:async({applicationId,stage})=>{
            await queryClient.cancelQueries({
                queryKey:['jobs',jobId,'applications',]
            })
            const previous = queryClient.getQueryData(['jobs',jobId,'applications',])
            queryClient.setQueryData(['jobs',jobId,'applications'],(old)=>{
                if(!old)return old
                return {
                    ...old,
                    applications: old.applications.map((a)=>
                    a.id===applicationId? {...a,stage} : a),
                }
            })
            return {previous}
        },
        onError: (_,__,ctx)=>{
            if (ctx?.previous){
                queryClient.setQueryData(
                    ['jobs',jobId,'applications'],
                    ctx.previous
                )
            }
        },
        onSettled:()=>{
            queryClient.invalidateQueries({
                queryKey:['jobs',jobId,'applications'],
            })
        },
    })
}