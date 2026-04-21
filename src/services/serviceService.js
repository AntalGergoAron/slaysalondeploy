import { supabase } from '../lib/supabaseClient'

export async function getAllServices() {
  const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('id', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createService(serviceData) {
  const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateService(serviceId, serviceData) {
  const { data, error } = await supabase
      .from('services')
      .update({
        ...serviceData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', serviceId)
      .select()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteService(serviceId) {
  const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}