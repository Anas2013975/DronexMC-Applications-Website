'use client';
import { useEffect,useState } from 'react';
import Link from 'next/link';
export default function Dashboard(){const [data,setData]=useState<any[]>([]),[user,setUser]=useState<any>(null),[err,setErr]=useState('');
 useEffect(()=>{fetch('/api/me').then(r=>r.json()).then(d=>setUser(d.user));fetch('/api/applications').then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||'Login required');setData(d.applications||[])}).catch(e=>setErr(e.message))},[]);
 return <main className="shell formwrap"><div className="split"><a className="brand" href="/">DRONEXMC</a><a className="btn" href="/">Home</a></div><h1>{user?`Welcome, ${user.username}`:'Your Dashboard'}</h1><p className="muted">Your submitted applications and current status.</p>{err&&<div className="notice">{err} — <a href="/api/auth/login?next=/dashboard">Login with Discord</a></div>}<div className="panel tablewrap"><table><thead><tr><th>Reference</th><th>Category</th><th>Submitted</th><th>Status</th></tr></thead><tbody>{data.map(a=><tr key={a.id}><td><Link href={'/status/'+a.ref_code}>{a.ref_code}</Link></td><td>{a.category}</td><td>{new Date(a.created_at).toLocaleDateString()}</td><td><span className={'badge '+a.status}>{a.status}</span></td></tr>)}</tbody></table>{!data.length&&!err&&<p className="muted">No applications yet. <Link href="/">Choose a team</Link>.</p>}</div></main>
}
