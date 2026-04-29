import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
    getAllServices,
    createService,
    updateService,
    deleteService,
} from '../services/serviceService'

export default function ServicesPage() {
    const { dbUser } = useAuth()

    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)

    const [serviceSubmitting, setServiceSubmitting] = useState(false)
    const [serviceError, setServiceError] = useState('')
    const [serviceSuccess, setServiceSuccess] = useState('')

    const [editingService, setEditingService] = useState(null)

    const [serviceFormData, setServiceFormData] = useState({
        name: '',
        description: '',
        duration_minutes: '',
        price: '',
        category: '',
        is_active: 'true',
    })

    const [serviceSearchTerm, setServiceSearchTerm] = useState('')
    const [serviceSortBy, setServiceSortBy] = useState('name-asc')

    const isAdmin = dbUser?.role === 'admin'

    const resetServiceForm = () => {
        setServiceFormData({
            name: '',
            description: '',
            duration_minutes: '',
            price: '',
            category: '',
            is_active: 'true',
        })
        setEditingService(null)
    }

    const loadServices = async () => {
        try {
            setLoading(true)
            setServiceError('')
            const servicesData = await getAllServices()
            setServices(servicesData)
        } catch (err) {
            setServiceError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadServices()
    }, [])

    const handleServiceChange = (event) => {
        const { name, value } = event.target

        setServiceFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleEditService = (service) => {
        if (!isAdmin) {
            setServiceError('Csak admin szerkeszthet szolgáltatást.')
            return
        }

        setServiceError('')
        setServiceSuccess('')
        setEditingService(service)

        setServiceFormData({
            name: service.name || '',
            description: service.description || '',
            duration_minutes: String(service.duration_minutes ?? ''),
            price: String(service.price ?? ''),
            category: service.category || '',
            is_active: String(service.is_active),
        })
    }

    const handleCancelServiceEdit = () => {
        setServiceError('')
        setServiceSuccess('')
        resetServiceForm()
    }

    const handleServiceSubmit = async (event) => {
        event.preventDefault()

        if (!isAdmin) {
            setServiceError('Csak admin hozhat létre vagy módosíthat szolgáltatást.')
            return
        }

        if (
            !serviceFormData.name.trim() ||
            !serviceFormData.duration_minutes ||
            !serviceFormData.price
        ) {
            setServiceError('A név, időtartam és ár megadása kötelező.')
            return
        }

        try {
            setServiceSubmitting(true)
            setServiceError('')
            setServiceSuccess('')

            const payload = {
                name: serviceFormData.name.trim(),
                description: serviceFormData.description.trim(),
                duration_minutes: Number(serviceFormData.duration_minutes),
                price: Number(serviceFormData.price),
                category: serviceFormData.category.trim(),
                is_active: serviceFormData.is_active === 'true',
            }

            if (editingService) {
                await updateService(editingService.id, payload)
                setServiceSuccess('A szolgáltatás sikeresen módosítva lett.')
            } else {
                await createService(payload)
                setServiceSuccess('A szolgáltatás sikeresen létrejött.')
            }

            resetServiceForm()
            await loadServices()
        } catch (err) {
            setServiceError(err.message)
        } finally {
            setServiceSubmitting(false)
        }
    }

    const handleDeleteService = async (service) => {
        if (!isAdmin) {
            setServiceError('Csak admin törölhet szolgáltatást.')
            return
        }

        const confirmed = window.confirm(
            `A(z) "${service.name}" szolgáltatást biztosan törölni szeretnéd?`
        )

        if (!confirmed) {
            return
        }

        try {
            setServiceError('')
            setServiceSuccess('')

            await deleteService(service.id)

            if (editingService && editingService.id === service.id) {
                resetServiceForm()
            }

            setServiceSuccess('A szolgáltatás sikeresen törölve lett.')
            await loadServices()
        } catch (err) {
            if (
                err.message.includes('foreign key constraint') ||
                err.message.includes('appointments_service_id_fkey')
            ) {
                setServiceError(
                    'Ez a szolgáltatás nem törölhető, mert már tartozik hozzá foglalás.'
                )
            } else {
                setServiceError(err.message)
            }
        }
    }

    const filteredSortedServices = useMemo(() => {
        let result = [...services]
        const search = serviceSearchTerm.trim().toLowerCase()

        if (search) {
            result = result.filter((service) => {
                const name = service.name?.toLowerCase() || ''
                return name.includes(search)
            })
        }

        switch (serviceSortBy) {
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
    }, [services, serviceSearchTerm, serviceSortBy, isAdmin])

    if (loading) {
        return <p>Betöltés...</p>
    }

    return (
        <section className="page-shell">
            <div className="page-header">
                <h1>Szolgáltatások</h1>
                <p className="page-intro">
                    Böngéssz a szolgáltatások között, hasonlítsd össze az árakat és időtartamokat,
                    majd válaszd ki a hozzád legjobban illő opciót.
                </p>
                {isAdmin && <span className="role-badge">Admin mód</span>}
            </div>

            <div className="service-page-top-grid">
                <article className="service-page-info-card">
                    <h3>Személyre szabott megoldások</h3>
                    <p className="service-page-note">
                        Letisztult, elegáns és alkalmi stílusok közül is választhatsz.
                    </p>
                </article>

                <article className="service-page-info-card">
                    <h3>Átlátható foglalás</h3>
                    <p className="service-page-note">
                        A szolgáltatások között könnyen kereshetsz és gyorsan foglalhatsz.
                    </p>
                </article>

                <article className="service-page-info-card">
                    <h3>Kényelmes online ügyintézés</h3>
                    <p className="service-page-note">
                        Néhány kattintással megtalálhatod a számodra megfelelő időpontot.
                    </p>
                </article>
            </div>

            {serviceError && <div className="alert alert--error">{serviceError}</div>}
            {serviceSuccess && <div className="alert alert--success">{serviceSuccess}</div>}

            {isAdmin && (
                <div className="panel">
                    <h2>
                        {editingService
                            ? 'Szolgáltatás szerkesztése'
                            : 'Új szolgáltatás létrehozása'}
                    </h2>

                    <form className="app-form" onSubmit={handleServiceSubmit}>
                        <div className="form-grid">
                            <div className="form-field">
                                <label htmlFor="service_name">Név</label>
                                <input
                                    id="service_name"
                                    name="name"
                                    type="text"
                                    value={serviceFormData.name}
                                    onChange={handleServiceChange}
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="category">Kategória</label>
                                <input
                                    id="category"
                                    name="category"
                                    type="text"
                                    value={serviceFormData.category}
                                    onChange={handleServiceChange}
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="duration_minutes">Időtartam (perc)</label>
                                <input
                                    id="duration_minutes"
                                    name="duration_minutes"
                                    type="number"
                                    min="1"
                                    value={serviceFormData.duration_minutes}
                                    onChange={handleServiceChange}
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="price">Ár (Ft)</label>
                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={serviceFormData.price}
                                    onChange={handleServiceChange}
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="is_active">Státusz</label>
                                <select
                                    id="is_active"
                                    name="is_active"
                                    value={serviceFormData.is_active}
                                    onChange={handleServiceChange}
                                >
                                    <option value="true">Aktív</option>
                                    <option value="false">Inaktív</option>
                                </select>
                            </div>

                            <div className="form-field form-field--full">
                                <label htmlFor="description">Leírás</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    value={serviceFormData.description}
                                    onChange={handleServiceChange}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                className="button button--primary"
                                type="submit"
                                disabled={serviceSubmitting}
                            >
                                {serviceSubmitting
                                    ? 'Mentés...'
                                    : editingService
                                        ? 'Módosítás mentése'
                                        : 'Szolgáltatás létrehozása'}
                            </button>

                            {editingService && (
                                <button
                                    className="button button--secondary"
                                    type="button"
                                    onClick={handleCancelServiceEdit}
                                >
                                    Mégse
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <div className="panel">
                <h2>Szolgáltatások keresése</h2>

                <div className="filter-grid">
                    <div className="form-field">
                        <label htmlFor="serviceSearchTerm">Keresés név alapján</label>
                        <input
                            id="serviceSearchTerm"
                            type="text"
                            value={serviceSearchTerm}
                            onChange={(event) => setServiceSearchTerm(event.target.value)}
                            placeholder="Például: zselés műköröm"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="serviceSortBy">Rendezés</label>
                        <select
                            id="serviceSortBy"
                            value={serviceSortBy}
                            onChange={(event) => setServiceSortBy(event.target.value)}
                        >
                            <option value="name-asc">Név szerint A-Z</option>
                            <option value="name-desc">Név szerint Z-A</option>
                            <option value="price-asc">Ár szerint növekvő</option>
                            <option value="price-desc">Ár szerint csökkenő</option>
                            <option value="duration-asc">Időtartam szerint növekvő</option>
                            <option value="duration-desc">Időtartam szerint csökkenő</option>
                        </select>
                    </div>
                </div>

                <div className="toolbar">
                    <p className="results-count">
                        Találatok száma: <strong>{filteredSortedServices.length}</strong>
                    </p>

                    <button
                        className="button button--secondary"
                        type="button"
                        onClick={() => {
                            setServiceSearchTerm('')
                            setServiceSortBy('name-asc')
                        }}
                    >
                        Szűrők törlése
                    </button>
                </div>
            </div>

            {filteredSortedServices.length === 0 ? (
                <div className="empty-state">
                    Nincs a feltételeknek megfelelő szolgáltatás.
                </div>
            ) : (
                <div className="services-grid">
                    {filteredSortedServices.map((service) => (
                        <article className="service-card" key={service.id}>
                            <h3>{service.name}</h3>
                            <p>{service.description || '-'}</p>
                            <p className="service-card__duration">
                                {service.duration_minutes} perc
                            </p>
                            <p className="service-card__price">{service.price} Ft</p>
                            <p>
                                <strong>Kategória:</strong> {service.category || '-'}
                            </p>
                            <p>
                                <strong>Állapot:</strong> {service.is_active ? 'Aktív' : 'Inaktív'}
                            </p>

                            {isAdmin && (
                                <div className="card-actions">
                                    <button
                                        className="button button--secondary"
                                        type="button"
                                        onClick={() => handleEditService(service)}
                                    >
                                        Szerkesztés
                                    </button>

                                    <button
                                        className="button button--secondary"
                                        type="button"
                                        onClick={() => handleDeleteService(service)}
                                    >
                                        Törlés
                                    </button>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}

            <div className="service-page-bottom-grid">
                <article className="service-page-info-card">
                    <h3>Mire figyelj foglalás előtt?</h3>
                    <p className="service-page-note">
                        Ha van elképzelésed vagy referencia képed, érdemes magaddal hozni,
                        így könnyebb a számodra legjobb stílust kiválasztani.
                    </p>
                </article>

                <article className="service-page-info-card">
                    <h3>Mennyi idővel érdemes számolni?</h3>
                    <p className="service-page-note">
                        A pontos időtartam a választott szolgáltatástól függ, ezért a listában
                        minden tételnél külön feltüntettük.
                    </p>
                </article>

                <article className="service-page-info-card">
                    <h3>Nem találod, amit keresel?</h3>
                    <p className="service-page-note">
                        Nézd meg a kapcsolat oldalt, vagy írj üzenetet, és segítünk a megfelelő
                        szolgáltatás kiválasztásában.
                    </p>
                </article>
            </div>
        </section>
    )
}