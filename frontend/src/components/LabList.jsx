import { useEffect, useState } from 'react';

export default function LabList({ subjectId }) {
  const [labs, setLabs] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const load = ()=>fetch(`http://localhost:4000/subjects/${subjectId}/labs`)
    .then(r=>r.json())
    .then(res => setLabs(res.data));

  useEffect(load, [subjectId]);

  const add = async e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('file', file);
    await fetch(`http://localhost:4000/subjects/${subjectId}/labs`, {
      method:'POST',
      headers: { 'x-user-id': 1, 'x-user-role': 'USER' },
      body: fd
    });
    setTitle(''); setFile(null);
    load();
  };

  const del = async id => {
    await fetch(`http://localhost:4000/labs/${id}`, { method:'DELETE' });
    load();
  };

  return (
    <div>
      <h2>Lab Materials</h2>
      <form onSubmit={add}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required/>
        <input type="file" onChange={e=>setFile(e.target.files[0])} required/>
        <button type="submit">Upload Lab</button>
      </form>
      <ul>
        {labs.map(l=>(
          <li key={l.id}>
            <a href={`http://localhost:4000${l.url}`} target="_blank">{l.title}</a>
            <span> by {l.user.name}</span>
            <button onClick={()=>del(l.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
