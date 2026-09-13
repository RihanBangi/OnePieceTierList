function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">

                <div className="footer-logo">
                    🏴‍☠️ One Piece Tier List
                </div>

                <p>
                    Rank your favorite One Piece characters
                    and create your ultimate crew.
                </p>

                <div className="footer-divider"></div>

                <p className="footer-copyright">
                    © {new Date().getFullYear()} One Piece Tier List.
                    Built with React & ASP.NET Core.
                </p>

            </div>
        </footer>
    );
}

export default Footer;