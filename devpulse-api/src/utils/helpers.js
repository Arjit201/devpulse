export const asyncHandler = (fn)=>(req,res,next)=>
    Promise.resolve(fn(req,res,next)).catch(next)
export async function paginate(model,{
    where={},
    orderBy={},
    cursor,
    limit=20,
    include
}={}){
    const take = Math.min(Number(limit)||20,100)
    const items = await model.findMany({
        where,
        orderBy,
        take:take+1,
        include,
        ...cursor && {cursor:{id:cursor},skip:1},
    })
    const total = await model.count({where})
    const hasMore = items.length>take
    if(hasMore){items.pop()}
    return {
        items,
        total,
        nextCursor: hasMore? items[items.length-1].id:null,
        hasMore,
    }
}