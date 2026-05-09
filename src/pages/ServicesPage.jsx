import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    getAllServices,
    createService,
    updateService,
    deleteService,
} from '../services/serviceService'

const featuredOptions = [
    {
        id: 1,
        title: 'Személyre szabott megoldások',
        text: 'Letisztult, elegáns és alkalmi stílusok közül is választhatsz, attól függően, hogy hétköznapra vagy különleges alkalomra keresel megoldást.',
    },
    {
        id: 2,
        title: 'Átlátható foglalás',
        text: 'A szolgáltatások között könnyen kereshetsz, össze tudod hasonlítani az árakat és időtartamokat, majd gyorsan foglalhatsz.',
    },
    {
        id: 3,
        title: 'Kényelmes online ügyintézés',
        text: 'Néhány kattintással megtalálhatod a számodra megfelelő szolgáltatást és időpontot, anélkül hogy külön egyeztetned kellene.',
    },
]

const popularChoices = [
    {
        id: 1,
        title: 'Első alkalomra',
        text: 'Ha most jössz először, érdemes egyszerűbb, kényelmesen viselhető megoldással kezdeni, amit könnyű megszokni a hétköznapokban is.',
    },
    {
        id: 2,
        title: 'Alkalmi megjelenéshez',
        text: 'Ha eseményre, ünnepre vagy fotózásra készülsz, a díszítettebb, hangsúlyosabb stílusok látványosabb összhatást adnak.',
    },
    {
        id: 3,
        title: 'Tartós hétköznapi viselethez',
        text: 'Ha fontos a praktikum és a tartósság, válassz olyan szolgáltatást, amely hosszabb ideig szép marad a mindennapi használat mellett is.',
    },
]

const faqItems = [
    {
        id: 1,
        question: 'Mennyi idővel számoljak?',
        answer: 'A választott szolgáltatástól függően általában 30–120 perc közötti idővel érdemes számolni.',
    },
    {
        id: 2,
        question: 'Lehet referencia képet hozni?',
        answer: 'Igen, ez sokat segít abban, hogy a kívánt stílus és színvilág minél pontosabban megvalósuljon.',
    },
    {
        id: 3,
        question: 'Mikor érdemes új időpontot foglalni?',
        answer: 'Általában 3–4 hetente ajánlott, de ez a köröm növekedésétől és a választott típustól is függhet.',
    },
]

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
            setServiceError(err.message)
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
                    Böngéssz a szolgáltatások között, hasonlítsd össze az árakat és
                    időtartamokat, majd válaszd ki a hozzád legjobban illő opciót.
                </p>
                {isAdmin && <span className="role-badge">Admin mód</span>}
            </div>

            <div className="service-page-top-grid">
                {featuredOptions.map((item) => (
                    <article className="service-page-info-card" key={item.id}>
                        <h3>{item.title}</h3>
                        <p className="service-page-note">{item.text}</p>
                    </article>
                ))}
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

            <div className="panel">
                <div className="page-header">
                    <h2>Népszerű választások</h2>
                    <p className="page-intro">
                        Segít eldönteni, melyik szolgáltatás lehet a legjobb választás a
                        stílusodhoz, alkalomhoz és elvárásaidhoz.
                    </p>
                </div>

                <div className="service-page-bottom-grid">
                    {popularChoices.map((item) => (
                        <article className="service-page-info-card" key={item.id}>
                            <h3>{item.title}</h3>
                            <p className="service-page-note">{item.text}</p>
                        </article>
                    ))}
                </div>
            </div>

            <div className="panel">
                <div className="page-header">
                    <h2>Foglalás előtt</h2>
                    <p className="page-intro">
                        Néhány hasznos információ, ami segít a választásban és a felkészülésben.
                    </p>
                </div>

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

                <div className="form-actions" style={{ marginTop: '1rem' }}>
                    <Link to="/foglalas" className="button button--primary">
                        Időpont foglalása
                    </Link>
                    <Link to="/kapcsolat" className="button button--secondary">
                        Kapcsolat
                    </Link>
                </div>
            </div>

            <div className="panel">
                <div className="page-header">
                    <h2>Gyakori kérdések</h2>
                </div>

                <div className="service-page-bottom-grid">
                    {faqItems.map((item) => (
                        <article className="service-page-info-card" key={item.id}>
                            <h3>{item.question}</h3>
                            <p className="service-page-note">{item.answer}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}