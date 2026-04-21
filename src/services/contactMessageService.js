import { supabase } from '../lib/supabaseClient'

export async function getAllContactMessages() {
    const { data, error } = await supabase
        .from('contact_messages')
        .select('*')

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function createContactMessage(messageData) {
    const payload = {
        name: messageData.name,
        email: messageData.email,
        phone: messageData.phone || null,
        subject: messageData.subject,
        message: messageData.message,
    }

    const { data, error } = await supabase
        .from('contact_messages')
        .insert([payload])
        .select()

    if (error) {
        throw new Error(error.message)
    }

    return data
}