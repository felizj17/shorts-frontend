import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'
import Modal from '../modal/Modal'
import './short.css'

export default function Shorts({shorts}) {
  const API = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const {userId} = useParams()
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const [date, setDate] = useState({})
  const [modal, setModal] = useState(false)
  const [edited, setEdited] = useState({})
  
  useEffect(() => {
    const dateFormat = date => {
      const theDate = date.toString().split('T')[0].split('-')
      const theTime = date.toString().split('T')[1].split(':')
      if (+theTime[0] > 12) {
        return {
          date: `${months[+theDate[1] - 1]} ${theDate[2]}, ${theDate[0]}`,
          time: `${+theTime[0] - 12}:${theTime[1]} `,
        }
      } else if (+theTime[0] === 0) {
        return {
          date: `${months[+theDate[1] - 1]} ${theDate[2]}, ${theDate[0]}`,
          time: `12:${theTime[1]} `,
        }
      } else {
        return {
          date: `${months[+theDate[1] - 1]} ${theDate[2]}, ${theDate[0]}`,
          time: `${+theTime[0]}:${theTime[1]}`,
        }
      }
    }
    setDate(dateFormat(shorts.created_at))
    if (shorts.edited_at) {
      setEdited(dateFormat(shorts.edited_at))
    }
  }, [shorts])
  const handleDelete = () => {
    if (modal) {
      axios
        .delete(`${API}/tweets/${shorts.id}`)
        .then(_ => navigate(`/${userId}/shorts`))
    } else {
      setModal(true)
    }
  }
  return (
    <div className='shorts-card'>
      {modal && (
        <Modal
          handleDelete={handleDelete}
          short={shorts}
          handleClose={() => setModal(false)}
        />
      )}

      <aside>
        <h3>{shorts.title}</h3>
      </aside>
      <p>
        {date.date} {date.time}GMT{' '}
        {shorts.edited_at ? `| Edited at ${edited.date} ${edited.time}` : null}
      </p>
      <span>
        <p>Read time: {shorts.read_time} min</p>
      </span>
      <aside className='buttons'>
        <section>
          <button
            className='read-btn'
            onClick={() => navigate(`/${userId}/shorts/${shorts.id}`)}
          >
            Read
          </button>
        </section>
        <section>
          <button
            className='btn'
            onClick={() => navigate(`/${userId}/shorts/edit/${shorts.id}`)}
          >
            ✏️
          </button>
          <button className='btn' id={shorts.id} onClick={handleDelete}>
            ❌
          </button>
        </section>
      </aside>
    </div>
  )
}
