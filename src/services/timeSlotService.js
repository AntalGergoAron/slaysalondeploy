import { supabase } from '../lib/supabaseClient'

export async function getAllTimeSlots() {
    const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .order('slot_date', { ascending: true })
        .order('start_time', { ascending: true })

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function markTimeSlotUnavailable(timeSlotId) {
    const { data, error } = await supabase
        .from('time_slots')
        .update({ is_available: false })
        .eq('id', timeSlotId)
        .select()

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function markTimeSlotAvailable(timeSlotId) {
    const { data, error } = await supabase
        .from('time_slots')
        .update({ is_available: true })
        .eq('id', timeSlotId)
        .select()

    if (error) {
        throw new Error(error.message)
    }

    return data
}