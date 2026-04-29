import { describe, it, expect } from 'vitest'
import { filterAndSortServices } from '../utils/serviceFilters'

const services = [
    { id: 1, name: 'Zselés köröm', price: 8000, duration_minutes: 90, is_active: true },
    { id: 2, name: 'Manikűr', price: 5000, duration_minutes: 45, is_active: true },
    { id: 3, name: 'Pedikűr', price: 7000, duration_minutes: 60, is_active: false }
]

describe('filterAndSortServices', () => {
    it('filters by name', () => {
        const result = filterAndSortServices(services, 'mani', 'name-asc', true)
        expect(result).toHaveLength(1)
        expect(result[0].name).toBe('Manikűr')
    })

    it('sorts by price ascending', () => {
        const result = filterAndSortServices(services, '', 'price-asc', true)
        expect(result[0].price).toBe(5000)
    })

    it('sorts by duration descending', () => {
        const result = filterAndSortServices(services, '', 'duration-desc', true)
        expect(result[0].duration_minutes).toBe(90)
    })

    it('hides inactive services for non-admin users', () => {
        const result = filterAndSortServices(services, '', 'name-asc', false)
        expect(result.some((service) => service.is_active === false)).toBe(false)
    })
})