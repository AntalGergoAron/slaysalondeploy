export function isValidEmail(email) {
    const value = String(email || '').trim()
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isValidPassword(password) {
    return String(password || '').length >= 6
}

export function validateContactForm(formData) {
    const errors = {
        name: '',
        email: '',
        subject: '',
        message: ''
    }

    const name = String(formData?.name || '').trim()
    const email = String(formData?.email || '').trim()
    const subject = String(formData?.subject || '').trim()
    const message = String(formData?.message || '').trim()

    if (!name) errors.name = 'A név megadása kötelező.'
    if (!email) {
        errors.email = 'Az email megadása kötelező.'
    } else if (!isValidEmail(email)) {
        errors.email = 'Érvénytelen email cím.'
    }

    if (!subject) errors.subject = 'A tárgy megadása kötelező.'
    if (!message) errors.message = 'Az üzenet megadása kötelező.'

    return errors
}

export function validateAppointmentForm(formData) {
    const errors = {
        service_id: '',
        time_slot_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: ''
    }

    const customerName = String(formData?.customer_name || '').trim()
    const customerEmail = String(formData?.customer_email || '').trim()
    const customerPhone = String(formData?.customer_phone || '').trim()

    if (!formData?.service_id) {
        errors.service_id = 'Válassz szolgáltatást.'
    }

    if (!formData?.time_slot_id) {
        errors.time_slot_id = 'Válassz időpontot.'
    }

    if (!customerName) {
        errors.customer_name = 'A név megadása kötelező.'
    }

    if (!customerEmail) {
        errors.customer_email = 'Az email cím megadása kötelező.'
    } else if (!isValidEmail(customerEmail)) {
        errors.customer_email = 'Adj meg egy érvényes email címet.'
    }

    if (!customerPhone) {
        errors.customer_phone = 'A telefonszám megadása kötelező.'
    } else if (customerPhone.length < 6) {
        errors.customer_phone = 'Adj meg egy érvényesebb telefonszámot.'
    }

    return errors
}