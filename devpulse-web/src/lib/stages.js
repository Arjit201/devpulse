export const STAGES = ['applied','screening','interview','offer','hired','rejected']
export const STAGE_CONFIG={
    applied:{
        label:'Applied',
        color:'bg-slate-100 text-slate-700 border-slate-200',
        dot:'bg-slate-400',
        headerBg:'bg-slate-50',
        headerBorder : 'border-slate-200'
    },
    screening: {
        label:        'Screening',
        color:        'bg-violet-100 text-violet-700 border-violet-200',
        dot:          'bg-violet-400',
        headerBg:     'bg-violet-50',
        headerBorder: 'border-violet-200',
    },
    interview: {
        label:        'Interview',
        color:        'bg-sky-100 text-sky-700 border-sky-200',
        dot:          'bg-sky-400',
        headerBg:     'bg-sky-50',
        headerBorder: 'border-sky-200',
    },
    offer: {
        label:        'Offer',
        color:        'bg-amber-100 text-amber-700 border-amber-200',
        dot:          'bg-amber-400',
        headerBg:     'bg-amber-50',
        headerBorder: 'border-amber-200',
    },
    hired: {
        label:        'Hired',
        color:        'bg-emerald-100 text-emerald-700 border-emerald-200',
        dot:          'bg-emerald-400',
        headerBg:     'bg-emerald-50',
        headerBorder: 'border-emerald-200',
    },
    rejected: {
        label:        'Rejected',
        color:        'bg-red-100 text-red-700 border-red-200',
        dot:          'bg-red-400',
        headerBg:     'bg-red-50',
        headerBorder: 'border-red-200',
    },
    }

    export const VALID_TRANSITIONS = {
    applied:   ['screening', 'rejected'],
    screening: ['interview', 'rejected'],
    interview: ['offer',     'rejected'],
    offer:     ['hired',     'rejected'],
    hired:     [],
    rejected:  [],
    }

    export const PIPELINE_STAGES = ['applied', 'screening', 'interview', 'offer', 'hired']