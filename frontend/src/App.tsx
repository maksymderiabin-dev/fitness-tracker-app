import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dumbbell, Clock, Trash2, PlusCircle, List, Activity } from 'lucide-react';

const API_URL = 'http://localhost:3000/workouts';

// --- СТОРІНКА 1 СПИСОК ТРЕНУВАНЬ ---
function Dashboard({ workouts, fetchWorkouts }: any) {
  const handleDelete = (id: number) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => fetchWorkouts())
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Мої тренування</h2>
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        {workouts.length === 0 ? <p>Тренувань поки нема. Додати першу!</p> : null}
        {workouts.map((w: any) => (
          <div key={w.id} style={{
            border: '1px solid #444', background: '#242424', padding: '20px', borderRadius: '12px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: '0 0 10px 0' }}>{w.title}</h3>
              <p style={{ color: '#aaa', margin: '5px 0' }}>Тип: {w.type}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#3498db' }}>
                <Clock size={16} /> <span>{w.duration} хвилин</span>
              </div>
            </div>
            <button onClick={() => handleDelete(w.id)} style={{
              background: '#e74c3c', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer'
            }}>
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- сторінка 2: форма додавання ---
function AddWorkout({ fetchWorkouts }: any) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Cardio');
  const [duration, setDuration] = useState('');
  const navigate = useNavigate(); // Для переходу на головну після створення

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post(API_URL, { title, type, duration: Number(duration) })
      .then(() => {
        fetchWorkouts();
        navigate('/'); // возврат на головну
      })
      .catch(err => alert("Ошибка: " + (err.response?.data?.message || err.message)));
  };

  return (
    <div>
      <h2>Додати тренування </h2>
      <form onSubmit={handleSubmit} style={{
        background: '#1e1e1e', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '15px'
      }}>
        <input placeholder="Название (мин. 3 буквы)" value={title} onChange={e => setTitle(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: 'none', background: '#333', color: '#fff' }} required />
        <select value={type} onChange={e => setType(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: 'none', background: '#333', color: '#fff' }}>
          <option value="Cardio">Cardio</option>
          <option value="Strength">Strength</option>
          <option value="Yoga">Yoga</option>
        </select>
        <input type="number" placeholder="Минут" value={duration} onChange={e => setDuration(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: 'none', background: '#333', color: '#fff' }} required />
        <button type="submit" style={{
          background: '#3498db', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer'
        }}>Зберегти</button>
      </form>
    </div>
  );
}

// --- 3 сторінка ---
function Stats({ workouts }: any) {
  const totalMinutes = workouts.reduce((sum: number, w: any) => sum + w.duration, 0);

  return (
    <div style={{ background: '#1e1e1e', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
      <h2>Твоя статистика</h2>
      <h1 style={{ color: '#2ecc71', fontSize: '48px', margin: '10px 0' }}>{workouts.length}</h1>
      <p style={{ color: '#aaa' }}>Всього тренувань</p>

      <h1 style={{ color: '#e74c3c', fontSize: '48px', margin: '20px 0 10px 0' }}>{totalMinutes}</h1>
      <p style={{ color: '#aaa' }}>Хвилин в спорте</p>
    </div>
  );
}

// --- головній компонент ---
function App() {
  const [workouts, setWorkouts] = useState([]);

  const fetchWorkouts = () => {
    axios.get(API_URL).then(res => setWorkouts(res.data)).catch(err => console.error(err));
  };

  useEffect(() => { fetchWorkouts(); }, []);

  // Стиль для кнопок меню
  const linkStyle = { color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', padding: '10px', background: '#333', borderRadius: '8px' };

  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>

        {/* ШАПКА і МЕНЮ */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #444', paddingBottom: '20px' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Dumbbell size={32} color="#3498db" /> Fitness Tracker
          </h1>
          <nav style={{ display: 'flex', gap: '10px' }}>
            <Link to="/" style={linkStyle}><List size={18} /> Список</Link>
            <Link to="/add" style={linkStyle}><PlusCircle size={18} /> Додати</Link>
            <Link to="/stats" style={linkStyle}><Activity size={18} /> Статистика</Link>
          </nav>
        </header>

        {/* Зміна сторінок */}
        <Routes>
          <Route path="/" element={<Dashboard workouts={workouts} fetchWorkouts={fetchWorkouts} />} />
          <Route path="/add" element={<AddWorkout fetchWorkouts={fetchWorkouts} />} />
          <Route path="/stats" element={<Stats workouts={workouts} />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;