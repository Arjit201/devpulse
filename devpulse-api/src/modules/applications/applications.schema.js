import {z} from 'zod';
export const applySchema = z.object({
    jobId : z.string().uuid(),
    coverLetter: z.string().max(3000).optional()
})
export const advanceStageSchema = z.object({
    stage: z.enum(['screening','interview','offer','hired','rejected']),
    note: z.string().max(500).optional(),
})
