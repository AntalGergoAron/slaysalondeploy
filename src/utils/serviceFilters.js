export function filterAndSortServices(services, searchTerm, sortBy, isAdmin) {
    let result = [...services]
    const search = String(searchTerm || '').trim().toLowerCase()

    if (search) {
        result = result.filter((service) => {
            const name = service.name?.toLowerCase() || ''
            return name.includes(search)
        })
    }

    switch (sortBy) {
        case 'name-desc':
            result.sort((a, b) => b.name.localeCompare(a.name))
            break
        case 'price-asc':
            result.sort((a, b) => Number(a.price) - Number(b.price))
            break
        case 'price-desc':
            result.sort((a, b) => Number(b.price) - Number(a.price))
            break
        case 'duration-asc':
            result.sort((a, b) => Number(a.duration_minutes) - Number(b.duration_minutes))
            break
        case 'duration-desc':
            result.sort((a, b) => Number(b.duration_minutes) - Number(a.duration_minutes))
            break
        case 'name-asc':
        default:
            result.sort((a, b) => a.name.localeCompare(b.name))
            break
    }

    if (!isAdmin) {
        result = result.filter((service) => service.is_active)
    }

    return result
}