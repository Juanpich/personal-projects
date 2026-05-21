import { useNavigate } from "react-router-dom"
import '../css/Home.css'

const SECTIONS = [
    {
        path: "/products",
        label: "Productos",
        description: "Administrá el catálogo: creá, editá y consultá el stock.",
        icon: "📦",
        accent: "#6c63ff",
    },
    {
        path: "/category",
        label: "Categorías",
        description: "Administrá el catálogo de categorías: creá, editá y consultá.",
        icon: "📑",
        accent: "#66ff63",
    },
    // Próximas secciones — descomentar cuando estén listas
    // { path: "/orders",  label: "Pedidos",  description: "Seguimiento de órdenes.", icon: "🧾", accent: "#00e5a0" },
    // { path: "/clients", label: "Clientes", description: "Base de clientes.",       icon: "👥", accent: "#f0a500" },
]

export const HomePage = () => {
    const navigate = useNavigate()

    return (
        <main className="home">
            <div className="home__bg" aria-hidden="true">
                <span className="home__blob home__blob--1" />
                <span className="home__blob home__blob--2" />
            </div>

            <header className="home__header">
                <p className="home__eyebrow">Panel de administración</p>
                <h1 className="home__title">
                    Bienvenido al<br />
                    <span className="home__title-accent">Dashboard</span>
                </h1>
                <p className="home__subtitle">Seleccioná una sección para comenzar.</p>
            </header>

            <div className="home__grid">
                {SECTIONS.map((s) => (
                    <button
                        key={s.path}
                        className="home__card"
                        style={{ "--card-accent": s.accent } as React.CSSProperties}
                        onClick={() => navigate(s.path)}
                    >
                        <span className="home__card-icon">{s.icon}</span>
                        <h2 className="home__card-label">{s.label}</h2>
                        <p className="home__card-desc">{s.description}</p>
                        <span className="home__card-arrow">→</span>
                    </button>
                ))}
            </div>
        </main>
    )
}
