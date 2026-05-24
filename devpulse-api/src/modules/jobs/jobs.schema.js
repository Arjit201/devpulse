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