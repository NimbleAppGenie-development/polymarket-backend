export default function NotFound() {
    return (
        <div
            className="container mt-5"
            style={{
                height: "100vh",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                backgroundColor: " #f8f9fa",
            }}
        >
            <h1 className="display-1 text-danger">404</h1>
            <h2 className="mb-3">Page Not Found</h2>
            <p className="lead">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
            <a href="/" className="btn btn-primary">
                Go Home
            </a>
        </div>
    );
}
