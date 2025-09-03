import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer bg-dark text-light py-3 mt-auto">
      <div className="container d-flex justify-content-between align-items-center">
        <span className="small">
          © {new Date().getFullYear()} Admin Panel. All rights reserved.
        </span>
        <span className="small">
          Built with <span className="text-danger">❤</span> & Bootstrap
        </span>
      </div>
    </footer>
  );
}
