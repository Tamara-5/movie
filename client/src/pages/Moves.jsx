import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import '../assets/styles/moves.scss'
import logout from '../assets/images/logout.png'
import Card from '../components/Card';

const Moves = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [move, setMove] = useState()
  const [page2, setPage2] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const email = localStorage.getItem('token')

  const onAddMove = () => {
    navigate("/create-move");
  }
  const onLogout = () => {
    localStorage.removeItem('token')
    navigate("/sing-in");
  }

  const getMove = async (pageNumber) => {
    const response = await axios.post(`${API_URL}/movie/get-list`, {
      email: email,
      limit: 10,
      page: pageNumber
    });
    if (response.data.data) {
      setTotalPages(Math.ceil(Number(response.data.data.totalCount / 10)))
      setMove(response.data.data.movies)
    }
    setLoading(false)
  }

  const onPageChaneg = async (pageNext) => {
    setPage2(pageNext)
    await getMove(pageNext)
  }
  useEffect(() => {
    let calledOnce = false;
    if (!calledOnce) {
      getMove(page2);
      calledOnce = true;
    }
  }, [])
  return (
    <div className={loading || !move?.length ? 'element-center' : ""}>
      {
        loading ? <h2 className='loading-text'>Loading </h2> : move && move?.length ? (
          <>
            <div className='create-movie-page'>
              <div className='create-movie-page-header'>
                <div className='create-movie-page-titiel'>
                  <h1>My movies</h1>
                  <div onClick={() => navigate("/create-move")} className='addNewMove'>+</div>
                </div>
                <div className='logout' onClick={() => onLogout()}>
                  <h2>Logout</h2>
                  <img src={logout} alt="logout" />
                </div>
              </div>
              <div className='movie-list'>
                {
                  move.map((item) => {
                    return <Card item={item} />
                  })
                }
              </div>
              <div className="pagination">
                <button
                  className="pagination__button"
                  onClick={() => onPageChaneg(page2 - 1)}
                  disabled={page2 === 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`pagination__page ${page2 === index + 1 ? 'active' : ''}`}
                    onClick={() => onPageChaneg(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="pagination__button"
                  onClick={() => onPageChaneg(page2 + 1)}
                  disabled={page2 === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className='empty-block'>
            <h2 className='text'>Your movie list is empty</h2>
            <button className="button" onClick={onAddMove}>
              Add a new movie
            </button>
          </div>
        )
      }

    </div >
  )
}

export default Moves