import ServiceCard from "../components/ServiceCard";

export default function ServicesPage() {
    const services = [
        { id: 1, title: "Gél lakkozás", duration: "60 perc", price: 6000 },
        { id: 2, title: "Műköröm építés", duration: "120 perc", price: 12000 },
        { id: 3, title: "Műköröm töltés", duration: "90 perc", price: 9000 },
        { id: 4, title: "Díszítés", duration: "30 perc", price: 2000 },
    ];

    return (
        <section>
            <h1>Szolgáltatások</h1>

            <div className="services-grid">
                {services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        title={service.title}
                        duration={service.duration}
                        price={service.price}
                    />
                ))}
            </div>
        </section>
    );
}