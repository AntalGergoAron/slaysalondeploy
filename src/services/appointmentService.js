import { supabase } from '../lib/supabaseClient'

export async function getAllAppointments() {
    const { data, error } = await supabase
        .from('appointments')
        .select(`
      id,
      user_id,
      service_id,
      time_slot_id,
      customer_name,
      customer_email,
      customer_phone,
      notes,
      status,
      created_at,
      users (
        id,
        full_name,
        email
      ),
      services (
        id,
        name,
        price,
        duration_minutes
      ),
      time_slots (
        id,
        slot_date,
        start_time,
        end_time
      )
    `)
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function createAppointment(appointmentData) {
    const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function updateAppointment(appointmentId, appointmentData) {
    const { data, error } = await supabase
        .from('appointments')
        .update(appointmentData)
        .eq('id', appointmentId)
        .select()

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function deleteAppointment(appointmentId) {
    const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId)

    if (error) {
        throw new Error(error.message)
    }

    return true
}