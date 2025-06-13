import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../redux/utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

function IndexRawPost({ genre, title }) {
    const [books, setBooks] = useState([]);
  const navigate = useNavigate()
  const scrollRef = useRef(null);

  const handlieClick =(bid)=>{
    navigate(`/book/${bid}`)
  }

  useEffect(() => {
    axiosInstance.get(`/indexbooks/?genre=${genre}`)
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [genre]);

  console.log("books",books)
  const scrollLeft = () => {
    scrollRef.current.scrollLeft -= scrollRef.current.offsetWidth;
  };

  const scrollRight = () => {
    scrollRef.current.scrollLeft += scrollRef.current.offsetWidth;
  };
  return (
    <div className="row">
      <h3>{title}</h3>
      <div className="posters-container">
        <button className="scroll-button left" onClick={scrollLeft}>{"<"}</button>
        <div className="posters" ref={scrollRef}>
          {books.map((book) => (
            <img
              key={book.id}
              className="poster"
              alt={book.title}
              src={book.images} // Adjust domain as needed
              title={book.title} style={{height:"300px"}}
              onClick={()=> handlieClick(book.id)}
            />
          ))}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>{">"}</button>
      </div>
    </div>
  )
}

export default IndexRawPost
