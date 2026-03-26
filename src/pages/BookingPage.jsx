import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function BookingPage() {
    const location = useLocation();

    const [name, setName] = useState("");
    const [service, setService] = useState(
        location.state?.selectedService || ""
    );
    const [date, setDate] = useState("");
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const savedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBookings(savedBookings);
    }, []);

    function handleSubmit(e) {
        e.preventDefault();

        if (!name || !service || !date) {
            alert("Kérlek tölts ki minden mezőt!");
            return;
        }

        const newBooking = {
            id: Date.now(),
            name,
            service,
            date,
        };

        const updatedBookings = [...bookings, newBooking];
        setBookings(updatedBookings);
        localStorage.setItem("bookings", JSON.stringify(updatedBookings));

        alert("Foglalás sikeresen mentve!");

        setName("");
        setService("");
        setDate("");
    }

    function handleDelete(id) {
        const updatedBookings = bookings.filter((booking) => booking.id !== id);
        setBookings(updatedBookings);
        localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    }

    return (
        <section>
            <h1>Időpontfoglalás</h1>

            <form className="booking-form" onSubmit={handleSubmit}>
                <label>
                    Név
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Add meg a neved"
                    />
                </label>

                <label>
                    Szolgáltatás
                    <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                    >
                        <option value="">Válassz szolgáltatást</option>
                        <option>Gél lakkozás</option>
                        <option>Műköröm építés</option>
                        <option>Műköröm töltés</option>
                        <option>Díszítés</option>
                    </select>
                </label>

                <label>
                    Dátum
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </label>

                <button type="submit" className="button button--primary">
                    Foglalás mentése
                </button>
            </form>

            <section className="booking-list-section">
                <h2>Mentett foglalások</h2>

                {bookings.length === 0 ? (
                    <p>Még nincs mentett foglalás.</p>
                ) : (
                    <div className="booking-list">
                        {bookings.map((booking) => (
                            <article key={booking.id} className="booking-card">
                                <h3>{booking.name}</h3>
                                <p>
                                    <strong>Szolgáltatás:</strong> {booking.service}
                                </p>
                                <p>
                                    <strong>Dátum:</strong> {booking.date}
                                </p>

                                <button
                                    type="button"
                                    className="button button--secondary"
                                    onClick={() => handleDelete(booking.id)}
                                >
                                    Törlés
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </section>
    );
}