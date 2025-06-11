import React, { useState } from 'react'
import UserFooter from './UserFooter'
import UserNavbar from './UserNavbar'
import bgimage1 from '../../assets/images/bgimage1.jpg'
import Cropper from 'react-easy-crop';
import {  useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addBook } from '../../redux/authSlices';

function UserAddBook() {

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
        image: null,
       
      });
      

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
                if (!blob) {
                    setErrors({ image: "Cropping failed or unsupported image format." });
                    return;
                  }
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
        if (!image){newErrors.image = "Image is Required"}
        
       
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Valid if no errors
      };



  const [backendError, setBackendError] = useState('');
      const handleSubmit =  async (e) =>{
        e.preventDefault();
        if (validate()){
            const croppedImage = await getCroppedImage();
            setBookData ({...bookeData,image:croppedImage.croppedFile});
            const updateBookData = {...bookeData,image:croppedImage.croppedFile}
           
                const resultAction = await dispatch(addBook(updateBookData))
                 if (addBook.rejected.match(resultAction)) {
                                const payload = resultAction.payload;
                                // Display backend error (could also check for specific fields like username or email)
                                let newErrors = {};
                                if (payload?.detail) {
                                    setBackendError(payload.detail);
                                  }
                            
                                  if (payload?.title) {
                                    newErrors.title = payload.title[0];  
                                  }
                            
                                  if (payload?.author) {
                                    console.log("yes author", payload.author[0])
                                    newErrors.author = payload.author[0]; 
                                  }
                            
                                  if (payload?.description) {
                                    newErrors.description = payload.description[0];
                                  }
                            
                                  if (payload?.nopage) {
                                    newErrors.nopages = payload.nopages[0];
                                  }
                                  setErrors(newErrors)
                              } else{
                                navigate('/userhome')}
        }
        
      }


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
        <h2 className="text-primary">Add Your BOOK</h2>

    </div>
           
            <div className="card p-4">
               

                    <form onSubmit={handleSubmit} >

                      <h4>Book Details</h4>
                        <div className="row" style={{color:'black'}}>
                        <div className="col-md-6">
                            <div className="form-group">
                            <label htmlFor="title" className="form-label fs-6">
                            {
                              errors.title ? (
                                <span style={{ color: "red" }}>{errors.title}</span>) : ("Title" )
                            }
                                
                                </label>
                            <textarea   value={bookeData.title} onChange={(e)=>{
                                setBookData({...bookeData,title:e.target.value})
                                if (errors.title) {
                                    setErrors({ ...errors, title: "" });
                                  }
                            }}
                                        className="form-control"
                                        id="title"
                                        rows="3" // You can adjust the number of rows
                                        ></textarea>
                   
                                        <p className="form-control-static fs-6"></p>
                            
                            </div>
                            <div className="form-group">
                            <label htmlFor="title" className="form-label fs-6">
                            {
                              errors.author ? (
                                <span style={{ color: "red" }}>{errors.author}</span>) : ("Author" )
                            }
                            </label>
                                        <input value={bookeData.author} onChange={(e)=>{
                                            setBookData({...bookeData,author:e.target.value})
                                            if (errors.author) {
                                                setErrors({ ...errors, author: "" });
                                              }
                                        }}
                                            type="text"
                                            className="form-control"
                                            id="title"/>
                                   
                                        <p className="form-control-static fs-6"></p>
                            
                            </div>

                            <div className="form-group">
                            <label htmlFor="title" className="form-label fs-6">
                            {
                              errors.genre ? (
                                <span style={{ color: "red" }}>{errors.genre}</span>) : ("Genre" )
                            }
                            </label>
                            <select id="inputState" className="form-select" name="genre" value={bookeData.genre}
                            onChange={(e)=>{
                                setBookData({...bookeData,genre:e.target.value})
                                if (errors.genre) {
                                    setErrors({ ...errors, genre: "" });
                                  }
                            }} >
                                         <option value="">Choose...</option>
                                         <option value="Classic">Classic</option>
                                         <option value="Crime">Crime</option>
                                         <option value="Comic">Comic</option>
                                         <option value="Fiction">Fiction</option>
                                         <option value="Kids">kids</option>
                                         <option value="Romance">Romance</option>
                                         <option value="Textbooks">Text Books</option>
                                         <option value="Thriller">Thriller</option>
                                         </select>
                            </div>

                            <div className="form-group">
                            <label htmlFor="publicationDate" className="form-label fs-6">
                            {
                              errors.publicationDate ? (
                                <span style={{ color: "red" }}>{errors.publicationDate}</span>) : ("Publication Date" )
                            }
                            </label>
                                <input
                                    value={bookeData.publicationDate}
                                    onChange={(e) => {setBookData({ ...bookeData, publicationDate: e.target.value })
                                    if (errors.publicationDate) {
                                        setErrors({ ...errors, publicationDate: "" });
                                      }
                                }}
                                    type="date"
                                    className="form-control"
                                    id="publicationDate"
                                    max={new Date().toISOString().split('T')[0]}   />                
                            </div>

                            <div className="form-group">
                            <label htmlFor="title" className="form-label fs-6">
                            {
                              errors.language ? (
                                <span style={{ color: "red" }}>{errors.language}</span>) : ("Language" )
                            }
                            </label>
                                        <input value={bookeData.language} onChange={(e)=>{
                                            setBookData({...bookeData,language:e.target.value})
                                            if (errors.language) {
                                                setErrors({ ...errors, language: "" });
                                              }
                                        }}
                                            type="text"
                                            className="form-control"
                                            id="title"/>
                                </div>

                            <div className="form-group">
                            <label htmlFor="title" className="form-label fs-6">
                            {
                              errors.nopages ? (
                                <span style={{ color: "red" }}>{errors.nopages}</span>) : ("Number of pages" )
                            }
                            </label>
                                        <input value={bookeData.nopages} onChange={(e)=>{
                                            setBookData({...bookeData,nopages:e.target.value})
                                            if (errors.nopages) {
                                                setErrors({ ...errors, nopages: "" });
                                              }
                                        }}
                                            type="text"
                                            className="form-control"
                                            id="title"/> 
                            </div>
                            <div className="form-group">
                            <label htmlFor="description" className="form-label fs-6">
                            {
                              errors.description ? (
                                <span style={{ color: "red" }}>{errors.description}</span>) : ("Description" )
                            }
                            </label>
                                        <textarea value={bookeData.description} onChange={(e)=>{
                                            setBookData({...bookeData,description:e.target.value})
                                            if (errors.description) {
                                                setErrors({ ...errors, description: "" });
                                              }
                                        }}
                                        className="form-control"
                                        id="description"
                                        rows="6" // You can adjust the number of rows
                                        ></textarea>
                            </div>

                        </div>


                        <div className="col-md-6">
                                <div className="form-group" style={{height:'550px',marginTop:"30px",position: 'relative' }}>
                                {preview && (
                                    <div style={{ marginBottom: '20px',position: 'relative' }}>
                                    <img src={preview.previewUrl} alt="Preview" style={{height:"450px", 
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
{/* Zoom Slider */}
                                           
                                            
                                           
                                </div>
                                <div className="col-mb-6" style={{marginBottom:"20px"}}>
                                            <label htmlFor="formFileMultiple" className="form-label">

                                            {
                              errors.image ? (
                                <span style={{ color: "red" }}>{errors.image}</span>) : ("Select Image" )
                            }
                                            </label>
                                            <input className="form-control" type="file" accept="image/*"      onChange={(e) => {
                                                if (errors.image) {
                                                    setErrors({ ...errors, image: "" });
                                                }
                                                handleFileChange(e); 
                                                }} />
                                        
                                            </div>
                                            <div className="col-mb-6">
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                            </div>
                                <p className="form-control-static fs-6"></p>
                                    
                            </div>

                            </div>
                            </form>
                          {/* Form ends here   */}


             
            </div>
        </div>
      <UserFooter/>
    </div>
   
  </div>
  )
}

export default UserAddBook
