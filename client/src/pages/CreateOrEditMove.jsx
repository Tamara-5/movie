import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import '../assets/styles/createOrEditMove.scss';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const CreateOrEditMove = ({ page }) => {
    let editItem = JSON.parse(localStorage.getItem('cardItem'))
    const API_URL = process.env.REACT_APP_API_URL;
    const API_URL_UPLOADS = process.env.REACT_APP_API_URL_UPLOADS;
    const [title, setTitle] = useState(editItem ? editItem.title : '');
    const [year, setYear] = useState(editItem ? editItem.year : '');
    const [file, setFile] = useState(editItem ? API_URL_UPLOADS + editItem.photo : null);
    const [previewImage, setPreviewImage] = useState(editItem ? API_URL_UPLOADS + editItem.photo : null);
    const navigate = useNavigate();
    const email = localStorage.getItem('token')

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length) {
                const file = acceptedFiles[0];
                setFile(file);
                setPreviewImage(URL.createObjectURL(file));
            }
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('year', year);
        formData.append('files', file);
        formData.append('email', email);
        if (page === 'edit') {
            formData.append('id', editItem.id);
            await axios.post(`${API_URL}/movie/edit`, formData);
        }
        else {
            await axios.post(`${API_URL}/movie/create`, formData);
        }
        navigate("/move")
    };

    return (
        <div className="create-movie-page">
            <h1>{page === 'edit' ? "Edit a movie" : 'Create a new movie'} </h1>
            <div className="form-container">
                <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    {previewImage ? (
                        <img src={previewImage} alt="Preview" className="preview-image" />
                    ) : (
                        <p>Drop an image here</p>
                    )}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            className='form-title'
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className='form-year'
                            type="Date"
                            placeholder="Publishing year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                    </div>
                    <div className="button-group">
                        <button type="button" className="cancel-button" onClick={() => navigate("/move")}>Cancel</button>
                        <button type="submit" className="submit-button">Submit</button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default CreateOrEditMove;
