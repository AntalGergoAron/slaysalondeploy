import { useNavigate } from "react-router-dom";

export default function ServiceCard({ title, duration, price }) {
    const navigate = useNavigate();

    function handleBooking() {
        navigate("/foglalas", {
            state: { selectedService: title },
        });
    }

    return (
        <div className="service-card">
            <h3>{title}</h3>

            <p className="service-card__duration">Időtartam: {duration}</p>

            <p className="service-card__price">Ár: {price} Ft</p>

            <button className="button button--primary" onClick={handleBooking}>
                Foglalás
            </button>
        </div>
    );
}