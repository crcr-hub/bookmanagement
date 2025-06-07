import React from 'react'
import carosel1 from "../../assets/images/carosel1.jpg";
import carosel2 from "../../assets/images/carosel2.jpg";

function Carosel() {
  return (
    <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel">

    <div className="carousel-indicators">
      <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
    </div>

    <div className="carousel-inner" >
      <div className="carousel-item active" data-bs-interval="4500">
        <img src={carosel1}   className="d-block "  style={{ width: "100%",height:"400px" }} alt="..." />
        <div className="carousel-caption d-none d-md-block">
         
        </div>
      </div>
      <div className="carousel-item" data-bs-interval="4000">
      <img src={carosel2}   className="d-block w-100" alt="..."  style={{ width: "100%",height:"400px" }} />
        <div className="carousel-caption d-none d-md-block">
         
        </div>
      </div>
      <div className="carousel-item">
      <img src={carosel1}   className="d-block w-100" alt="..."  style={{ width: "100%",height:"400px" }} />
        <div className="carousel-caption d-none d-md-block">
        </div>
      </div>
    </div>
    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>
  )
}

export default Carosel
