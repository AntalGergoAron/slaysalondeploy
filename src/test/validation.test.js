import { describe, it, expect } from 'vitest'
import {
    isValidEmail,
    isValidPassword,
    validateContactForm,
    validateAppointmentForm
} from '../utils/validation.js'

describe('validation helpers', () => {
    it('accepts a valid email', () => {
        expect(isValidEmail('teszt@example.com')).toBe(true)
    })

    it('rejects an invalid email', () => {
        expect(isValidEmail('rossz-email')).toBe(false)
    })

    it('accepts password with minimum 6 characters', () => {
        expect(isValidPassword('123456')).toBe(true)
    })

    it('rejects password shorter than 6 characters', () => {
        expect(isValidPassword('12345')).toBe(false)
    })

    it('contact form returns error for empty name', () => {
        const errors = validateContactForm({
            name: '',
            email: 'teszt@example.com',
            subject: 'Tárgy',
            message: 'Üzenet'
        })

        expect(errors.name).toBeTruthy()
    })

    it('contact form returns error for invalid email', () => {
        const errors = validateContactForm({
            name: 'Beni',
            email: 'hibas',
            subject: 'Tárgy',
            message: 'Üzenet'
        })

        expect(errors.email).toBeTruthy()
    })

    it('appointment form returns error when service is missing', () => {
        const errors = validateAppointmentForm({
            service_id: '',
            time_slot_id: '2',
            customer_name: 'Beni',
            customer_email: 'teszt@example.com',
            customer_phone: '1234567'
        })

        expect(errors.service_id).toBeTruthy()
    })

    it('appointment form returns error when time slot is missing', () => {
        const errors = validateAppointmentForm({
            service_id: '1',
            time_slot_id: '',
            customer_name: 'Beni',
            customer_email: 'teszt@example.com',
            customer_phone: '1234567'
        })

        expect(errors.time_slot_id).toBeTruthy()
    })

    it('appointment form returns error for invalid customer email', () => {
        const errors = validateAppointmentForm({
            service_id: '1',
            time_slot_id: '2',
            customer_name: 'Beni',
            customer_email: 'hibas',
            customer_phone: '1234567'
        })

        expect(errors.customer_email).toBeTruthy()
    })

    it('appointment form returns error for too short phone number', () => {
        const errors = validateAppointmentForm({
            service_id: '1',
            time_slot_id: '2',
            customer_name: 'Beni',
            customer_email: 'teszt@example.com',
            customer_phone: '123'
        })

        expect(errors.customer_phone).toBeTruthy()
    })
})