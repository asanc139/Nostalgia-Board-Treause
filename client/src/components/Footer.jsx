export default function Footer() {
  return (
    <div>
      <footer className="footer footer-center bg-base-300 text-base-content border-t border-base-content/1- py-6 px-4">
        <nav className="flex flex-wrap justify-ceter gap-4">
          <a href="#" className="link link-hover">
            About
          </a>
          <a href="#" className="link link-hover">
            Privacy
          </a>
          <a href="#" className="link link-hover">
            Terms
          </a>
          <a href="#" className="link link-hover">
            Help
          </a>
        </nav>
        <p className="text-sm opacity-70">
          &copy; 2026 NostalgiaBoard. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
