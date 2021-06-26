import "./Footer.css";

function Footer() {
  return (
    <footer className="text-center text-lg-start">
      <div className="mt-3">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
            <p className="text-uppercase colorDesign footer-p">OpTask</p>
            <p> Built by Shwet Khatri</p>
          </div>
          <div className="col-lg3 col-md-6 mb-4 mb-md-0">
            <p className="text-uppercase colorDesign footer-p">Links</p>
            <ul className="list-unstyled mb-0">
              <li>
                <a
                  href="https://www.linkedin.com/in/shwet-khatri-4ab216196/"
                  className="text-dark"
                  target="_blank"
                >
                  Linkedin
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ShwetKhatri2001"
                  className="text-dark"
                  target="_blank"
                >
                  Github
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
