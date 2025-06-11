import React, { useEffect, useState } from 'react'
import UserFooter from './UserFooter'
import UserNavbar from './UserNavbar'
import bgimage1 from '../../assets/images/bgimage1.jpg'
import Cropper from 'react-easy-crop';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { addBook, deleteBook, updateBook, updateBookDetails, userDetails } from '../../redux/authSlices';

function UserUpdateBook() {
    const [isEditing, setIsEditing] = useState(false);
    const {bid} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [bookeData, setBookData] = useState({
        title: "",
        author: "",
        genre:"",
        publicationDate: "",
        nopages: "",
        language: "",
        description:"",
        images: null,
       
      });
    
    const [originalData, setOriginalData] = useState({
                title: "",
                author: "",
                genre:"",
                publicationDate: "",
                nopages: "",
                language: "",
                description:"",
                images: null,
        })
      
      const {bookdetails} = useSelector((state)=>state.auth)
      useEffect (()=>{
        if (bid){
            dispatch(updateBook(bid))
        }
      },[dispatch,bid])


    useEffect(()=>{
        if (bookdetails){
            const initialData = {
                
                title: bookdetails.title || '',
                author: bookdetails.author || '',
                genre: bookdetails.genre || "",
                publicationDate: bookdetails.publicationDate || "",
                nopages: bookdetails.nopage || "",
                language: bookdetails.language || "",
                description:bookdetails.description || "",
                images:bookdetails.images || "",
            }
            setOriginalData(initialData)
            setBookData(initialData)

        }
    },[bookdetails])
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
      };
    
      const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setImage(reader.result);
          };
          reader.readAsDataURL(file);
          setShowCropper(true)
        }
      };

      const [preview, setPreview] = useState(null);
    
      const getCroppedImage = async () => {
        if (image && croppedAreaPixels) {
          const canvas = document.createElement('canvas');
          const img = new Image();
          img.src = image;
    
          return new Promise((resolve) => {
            img.onload = () => {
              const ctx = canvas.getContext('2d');
              canvas.width = croppedAreaPixels.width;
              canvas.height = croppedAreaPixels.height;
              ctx.drawImage(
                img,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
              );
              canvas.toBlob((blob) => {
                
                const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                const previewUrl = URL.createObjectURL(blob); // Preview URL
                resolve({ croppedFile, previewUrl });
              }, 'image/jpeg');
            };
          });
        }
      };


      const handlePreview = async () => {
       
        if (image && croppedAreaPixels) {
          const croppedImage = await getCroppedImage(image, croppedAreaPixels);
          setPreview(croppedImage);
          setShowCropper(false)
        }
      };


      



    const [errors, setErrors] = useState({});    
    const containsHTMLTags = (input) => /<[^>]*>/.test(input);
    const hasAlphabets = (text) => /[a-zA-Z]/.test(text);
    const hasLettersOrNumbers = (text) => /[a-zA-Z0-9]/.test(text);

    const validate = () => {
        let newErrors = {};
    
        if (!bookeData.title) {
          newErrors.title = "Title is required";}
        else if (containsHTMLTags(bookeData.title)){
          newErrors.title = "Invalid input (No HTML tags allowed)";

        }else if (!hasAlphabets(bookeData.title)) {
          newErrors.title = "Title must contain at least one alphabet";
        } 
        if (!bookeData.author) {newErrors.author = "Author name is required";}
        else if (containsHTMLTags(bookeData.author)) {
          newErrors.author = "Invalid input (No HTML tags allowed)";
        }else if (!hasAlphabets(bookeData.author)) {
        newErrors.author = "Author name must contain at least one alphabet";
        } 
        if (!bookeData.language) {newErrors.language = "Language  is required";}
        else if (containsHTMLTags(bookeData.language)) {
          newErrors.language = "Invalid input (No HTML tags allowed)";
        }else if (!hasAlphabets(bookeData.language)) {
        newErrors.language = "Language  must contain at least one alphabet";
        } 

        if (!bookeData.nopages) {
            newErrors.nopages = "Number of Pages is required";
          } else if (containsHTMLTags(bookeData.nopages)) {
            newErrors.nopages = "Invalid input (No HTML tags allowed)";
          } else if (isNaN(bookeData.nopages) || parseInt(bookeData.nopages) <= 0) {
            newErrors.nopages = "Number of Pages must be a valid positive number";
          }
      
        if (!bookeData.genre) {newErrors.genre = "Genre is required";}
        else if(!hasLettersOrNumbers(bookeData.genre)){
          newErrors.genre = "Genre must contain a character";
        }
        if (!bookeData.publicationDate) {newErrors.publicationDate = "Publication Date is required";}

        if (!bookeData.description) {newErrors.description = "Description is required";}
        else if (containsHTMLTags(bookeData.description)) {
          newErrors.description = "Invalid input (No HTML tags allowed)";
        }else if (!hasAlphabets(bookeData.description)) {
        newErrors.description = "Description  must contain at least one alphabet";
        } 
        
       
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Valid if no errors
      };



  const [backendError, setBackendError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalImageFile = null;
  
    // Step 1: Get cropped image if needed
    if (image && croppedAreaPixels) {
      try {
        const croppedImageResult = await getCroppedImage(image, croppedAreaPixels); // should return { croppedFile: File }
        if (croppedImageResult) {
          finalImageFile = croppedImageResult.croppedFile;
        } else {
          console.warn("getCroppedImage did not return a valid croppedFile.");
        }
      } catch (error) {
        console.error("Error getting cropped image:", error);
      }
    }
    
    // Step 2: Construct updated book data
    const updateBookData = {
      ...bookeData,
      ...(finalImageFile && { images: finalImageFile }), // Only add `images` if finalImageFile exists
    };
  
    setBookData(updateBookData);
    
    // Step 3: Dispatch update
    if (validate()) {
   
    const resultAction = await dispatch(updateBookDetails({ bid, updatedBookData: updateBookData }));
      if (updateBookDetails.rejected.match(resultAction)) {
        const payload = resultAction.payload;
        let newErrors = {};
  
        if (payload?.detail) setBackendError(payload.detail);
        if (payload?.title) newErrors.title = payload.title[0];
        if (payload?.author) newErrors.author = payload.author[0];
        if (payload?.description) newErrors.description = payload.description[0];
        if (payload?.nopage) newErrors.nopages = payload.nopages[0];
  
        setErrors(newErrors);
      } else {
       setIsEditing(false)
      }
    }
  };
  
      const handleCancelButton =()=>{
        setIsEditing(false);
        setPreview(null);
        setErrors({});
        setBookData(originalData)
        setImage(null); // Clear the image selected for cropping
        setShowCropper(false);
      }

      const handleDelete = async () => {
        const confirmed = window.confirm("⚠️ Are you sure you want to remove this book? This action cannot be undone.");
      
        if (confirmed) {
          try {
            // dispatch soft delete or actual delete action here
            await dispatch(deleteBook(bid)); // or book.id
            navigate('/mybooks'); // or wherever you want to redirect
          } catch (error) {
            console.error("Failed to delete book:", error);
          }
        }
      };
      

  return (
    <div
    style={{
      backgroundImage: `url(${bgimage1})`,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
     
      overflow: 'hidden', // prevent body scroll
    }}
  >
    {/* Fixed Navbar */}
    <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
    <UserNavbar/>
    </div>

    {/* Scrollable Content Below Navbar */}

   
    <div
      style={{
        marginTop: '50px', // adjust this based on your Navbar height
        height: 'calc(100vh - 50px)',
        overflowY: 'auto',
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // optional for modern effect
        padding: '2rem',
        
      }}
    >

{/* <div style={{ minHeight: '200vh' }}> */}
<div className="container mt-2" style={{marginBottom:"50px"}}>
    <div className="profile-header mb-4">
        <h2 className="text-primary">Your BOOK</h2>

    </div>
            <div className="card p-4">
                <div className="row" style={{color:'black'}}>                    
                <h4>View and Update Your Book</h4>
         
                <div className="col-md-6">
                            <div className="form-group">
                            <label htmlFor="title" className="form-label fs-6">
                            {
                              errors.title ? (
                                <span style={{ color: "red" }}>{errors.title}</span>) : ("Title" )
                            }
                                
                                </label>
                                {isEditing ? ( <textarea   value={bookeData.title} onChange={(e)=>{
                                setBookData({...bookeData,title:e.target.value})
                                if (errors.title) {
                                    setErrors({ ...errors, title: "" });}
                                    }}
                                        className="form-control"
                                        id="title"
                                        rows="3" 
                                        ></textarea>):(
                                            <p className="form-control-static fs-6">{bookeData?.title}</p>
                                        )}
                            </div>


                            <div className="form-group">
                                    <label htmlFor="title" className="form-label fs-6">
                                        {
                                        errors.author ? (
                                        <span style={{ color: "red" }}>{errors.author}</span>) : ("Author" )
                                        }
                                    </label>
                                        {isEditing? (<input value={bookeData.author} onChange={(e)=>{
                                                    setBookData({...bookeData,author:e.target.value})
                                                    if (errors.author) {
                                                        setErrors({ ...errors, author: "" });
                                                    }
                                                }}
                                                    type="text"
                                                    className="form-control"
                                                    id="title"/>):(<p className="form-control-static fs-6">{bookeData?.author}</p>)}     
                            </div>

                            <div className="form-group">
                            <label htmlFor="title" className="form-label fs-6">
                            {
                              errors.genre ? (
                                <span style={{ color: "red" }}>{errors.genre}</span>) : ("Genre" )
                            }
                            </label>
                            {isEditing?(<select id="inputState" className="form-select" name="genre" value={bookeData.genre}
                            onChange={(e)=>{
                                setBookData({...bookeData,genre:e.target.value})
                                if (errors.genre) {
                                    setErrors({ ...errors, genre: "" });
                                  }
                            }} >
                                         <option value="">Choose...</option>
                                         <option value="Fiction">Fiction</option>
                                         <option value="Classic">Classic</option>
                                         <option value="Crime">Crime</option>
                                         <option value="Romance">Romance</option>
                                         <option value="Kids">kids</option>
                                         <option value="Thriller">Thriller</option>
                                         <option value="Textbooks">Text Books</option>
                                         </select>):(<p className="form-control-static fs-6">{bookeData?.genre}</p>)}
                            
                            </div>

                            <div className="form-group">
                            <label htmlFor="publicationDate" className="form-label fs-6">
                            {
                              errors.publicationDate ? (
                                <span style={{ color: "red" }}>{errors.publicationDate}</span>) : ("Publication Date" )
                            }
                            </label>
                            {isEditing?(<input
                                    value={bookeData.publicationDate}
                                    onChange={(e) => {setBookData({ ...bookeData, publicationDate: e.target.value })
                                    if (errors.publicationDate) {
                                        setErrors({ ...errors, publicationDate: "" });
                                      }
                                }}
                                    type="date"
                                    className="form-control"
                                    id="publicationDate"
                                    max={new Date().toISOString().split('T')[0]}   />       )
                                :(
                                    <p className="form-control-static fs-6">{bookeData?.publicationDate}</p> 
                                )}
                                         
                            </div>

                            <div className="form-group">
                            <label htmlFor="title" className="form-label fs-6">
                            {
                              errors.language ? (
                                <span style={{ color: "red" }}>{errors.language}</span>) : ("Language" )
                            }
                            </label>
                            {isEditing ?( <input value={bookeData.language} onChange={(e)=>{
                                            setBookData({...bookeData,language:e.target.value})
                                            if (errors.language) {
                                                setErrors({ ...errors, language: "" });
                                              }
                                        }}
                                            type="text"
                                            className="form-control"
                                            id="title"/>):(<p className="form-control-static fs-6">{bookeData?.language}</p> )}
                                       
                                </div>

                            <div className="form-group">
                            <label htmlFor="title" className="form-label fs-6">
                            {
                              errors.nopages ? (
                                <span style={{ color: "red" }}>{errors.nopages}</span>) : ("Number of pages" )
                            }
                            </label>
                            {isEditing?(<input value={bookeData.nopages} onChange={(e)=>{
                                            setBookData({...bookeData,nopages:e.target.value})
                                            if (errors.nopages) {
                                                setErrors({ ...errors, nopages: "" });
                                              }
                                        }}
                                            type="text"
                                            className="form-control"
                                            id="title"/> ):(<p className="form-control-static fs-6">{bookeData?.nopages}</p>)}
                                        
                            </div>
                            <div className="form-group">
                            <label htmlFor="description" className="form-label fs-6">
                            {
                              errors.description ? (
                                <span style={{ color: "red" }}>{errors.description}</span>) : ("Description" )
                            }
                            </label>
                            {isEditing?( <textarea value={bookeData.description} onChange={(e)=>{
                                            setBookData({...bookeData,description:e.target.value})
                                            if (errors.description) {
                                                setErrors({ ...errors, description: "" });
                                              }
                                        }}
                                        className="form-control"
                                        id="description"
                                        rows="6" // You can adjust the number of rows
                                        ></textarea>):(<p className="form-control-static fs-6">{bookeData?.description}</p>)}
                                       
                            </div>
                        </div>


                        <div className="col-md-6">
                            {isEditing?(
                                <>
                                <div className="form-group" style={{height:'550px',marginTop:"30px",position: 'relative' }}>
                                {preview && preview ? (
                                    <div style={{ marginBottom: '20px',position: 'relative' }}>
                                    <img src={preview.previewUrl} alt="Preview" style={{height:"450px", 
                                        width: '390px',
                                         borderRadius: '10px',
                                         position: 'relative',
                                        zIndex: 1, }} />
                                    </div>
                                ):(
                                    <div style={{ marginBottom: '20px',position: 'relative' }}>
                                    <img src={bookeData && bookeData.images ? `http://127.0.0.1:8000${bookeData.images}` : '/default-book.jpg'} alt="Preview" 
                                       style={{height:"450px", 
                                        width: '390px',
                                         borderRadius: '10px',
                                         position: 'relative',
                                        zIndex: 1, }} />
                                    </div>  
                                )}
                               

                                            {/* Image Cropping */}
                                            {image &&   showCropper &&(<>
                                            <div style={{ 
                                                marginTop:"100px",
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '350px',     // FIXED height
                                                zIndex: 2,
                                                background: 'rgba(255,255,255,0.8)',
                                                // position: 'absolute', height: 350, width: '100%' 
                                                
                                                }}>
                                                <Cropper
                                                image={image}
                                                crop={crop}
                                                zoom={zoom}
                                                aspect={6.5 / 10}
                                                onCropChange={setCrop}
                                                onCropComplete={onCropComplete}
                                                onZoomChange={setZoom}
                                                />
                                            </div>

                                            <div className="controls" style={{
                                                 position: 'absolute', bottom: 10, left: 10, zIndex: 3
                                                // position: 'absolute', bottom: 10, left: 10 
                                                }}>
                                            <input
                                                type="range"
                                                value={zoom}
                                                min={1}
                                                max={4}
                                                step={0.01}
                                                onChange={(e) => setZoom(e.target.value)}
                                            />

                                                <button
                                                    className="btn btn-secondary mt-3"
                                                    type="button"
                                                    onClick={handlePreview}
                                                    style={{marginLeft:"25px"}}
                                                >
                                                   Select
                                                </button>
                                            </div>

                                            </>
                                            )}
                                </div>

                                <div className="col-mb-6" style={{marginBottom:"20px"}}>
                                            <label htmlFor="formFileMultiple" className="form-label">
                                            Select Image
                                            </label>
                                            <input className="form-control" type="file" accept="images/*"  onChange={handleFileChange} />
                                        
                                            </div>
                                            <div className="col-mb-6">
                                            <button type="submit" className="btn btn-success" onClick={handleSubmit}>Submit</button>
                                            <button type="button" className="btn btn-secondary ms-2"
                                            onClick={handleCancelButton}>Cancel</button>
                                            </div>
                                            
                                            </>
                                        ):(                                      
                                            <div className="form-group" style={{height:'550px',marginTop:"30px"}}>
                                                <div style={{ marginBottom: '20px',position: 'relative' }}>
                                                    <img src={bookeData && bookeData.images ? `http://127.0.0.1:8000${bookeData.images}` : '/default-book.jpg'} alt="Preview" style={{height:"450px", 
                                                        width: '390px',
                                                        borderRadius: '10px',
                                                        position: 'relative',
                                                        zIndex: 1, }} />
                                                </div>
                                                <div className="col-mb-6" style={{marginTop:"50px"}}>

                                                <button type="button" className="btn btn-primary"
                                                        onClick={()=>setIsEditing(true)}
                                                        >Update Book</button>

                                                        <button type="button" className="btn btn-warning" style={{marginLeft:"10px"}}
                                                       onClick={handleDelete}
                                                        >Remove Book</button>
                                                </div>
                                                        
                                            </div>
                                        )}
                                                                
                            </div>
            </div>
            </div>
        </div>
      <UserFooter/>
    </div>
   
  </div>
  )
}

export default UserUpdateBook
