import React from 'react'

function UserFooter() {
  return (
    <footer className="text-center text-lg-start bg-dark text-white pt-4">
    <div className="container p-4">

      {/* Social media buttons */}
      <section className="mb-4">
        {["facebook", "twitter", "google", "instagram", "linkedin", "github"].map((platform) => (
          <a
            key={platform}
            className="btn btn-outline-light btn-floating m-1"
            href="#!"
            role="button"
          >
            <i className={`fab fa-${platform}`}></i>
          </a>
        ))}
      </section>

      {/* Newsletter form */}
      <section className="">
        <form>
          <div className="row d-flex justify-content-center">
            <div className="col-auto">
              <p className="pt-2">
                <strong>Sign up for our newsletter</strong>
              </p>
            </div>

            <div className="col-md-5 col-12">
              <div className="form-outline form-white mb-4">
                <input type="email" id="form5Example2" className="form-control" placeholder="Email address" />
              </div>
            </div>

            <div className="col-auto">
              <button type="submit" className="btn btn-outline-light mb-4">
                Subscribe
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Description */}
      <section className="mb-4">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt distinctio earum repellat quaerat
          voluptatibus placeat nam, commodi optio pariatur est quia magnam eum harum corrupti dicta, aliquam
          sequi voluptate quas.
        </p>
      </section>

      {/* Links */}
      <section>
        <div className="row">
          {[1, 2, 3, 4].map((col) => (
            <div key={col} className="col-lg-3 col-md-6 mb-4 mb-md-0">
              <h5 className="text-uppercase">Links</h5>
              <ul className="list-unstyled mb-0">
                <li><a href="#!" className="text-white">Link 1</a></li>
                <li><a href="#!" className="text-white">Link 2</a></li>
              </ul>
            </div>
          ))}
        </div>
      </section>

    </div>

    <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
      © Copyright:
      <a className="text-white ms-1" href="https://mdbootstrap.com/">booksapp.com</a>
    </div>
  </footer>
  )
}

export default UserFooter
