export const VALID_TRANSITIONS = {
    applied:['screening','rejected'],
    screening:['interview','rejected'],
    interview:['offer','rejected'],
    offer:['hired','rejected'],
    rejected:[],
    hired:[],
}
export function isValidTransition(from,to){
    return (VALID_TRANSITIONS[from]??[]).includes(to)
}