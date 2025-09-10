import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer bg-dark text-light py-3 mt-auto">
      <div className="container d-flex justify-content-center align-items-center">
        <span className="small">
          © {new Date().getFullYear()} FIIT Jobs Admin Panel. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
