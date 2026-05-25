import {z} from 'zod'

export const createJobSchema = z.object({
    title : z.string().min(3).max(120),
    description : z.string().min(20),
    location : z.string().optional(),
    type: z.enum(['part_time','full_time','contract','internship']).default('full_time'),
    salaryMin: z.number().int().positive().optional(),
    salaryMax: z.number().int().positive().optional(),
    expiresAt: z.string().datetime().optional(),
})
export const updateJobSchema = createJobSchema.partial().extend({
    status: z.enum(['closed','open','draft']).optional(),
})
export const listJobsQuerySchema = z.object({
    search: z.string().optional(),
    type: z.enum(['full_time','part_time','internship','contract']).optional(),
    location: z.string().optional(),
    cursor: z.string().uuid().optional(),
    limit: z.coerce.number().int().min(1).max(50).default(20),
})