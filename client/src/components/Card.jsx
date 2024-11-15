import React from 'react';
import '../assets/styles/card.scss';
import { useNavigate } from "react-router-dom";
import edit from '../assets/images/edit.png'

const Card = ({ item }) => {
    const API_URL = process.env.REACT_APP_API_URL_UPLOADS;
    const navigate = useNavigate();

    const onEditItem = () => {
        localStorage.setItem('cardItem', JSON.stringify(item))
        navigate("/edit-move");
    }

    return (
        <div key={item.id} className="movie-card">
            <div className="movie-card__image-container">
                <img src={API_URL + item.photo} alt={item.title} className="movie-card__image" />
            </div>
            <div className="movie-card__details">
                <h3 className="movie-card__title">{item.title}</h3>
                <p className="movie-card__year">{item.year}</p>
            </div>
            <div className='edit' onClick={onEditItem}>
                <img src={edit} alt="edit" />
            </div>
        </div>
    );
};

export default Card;