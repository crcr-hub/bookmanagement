import React, { useEffect, useRef, useState } from "react";
import './RawPost.css'
import axiosInstance from "../../redux/utils/axiosInstance";

function RawPost({ genre, title }) {
  const [books, setBooks] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    axiosInstance.get(`/books/?genre=${genre}`)
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
            />
          ))}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>{">"}</button>
      </div>
    </div>
  );
}

export default RawPost;
