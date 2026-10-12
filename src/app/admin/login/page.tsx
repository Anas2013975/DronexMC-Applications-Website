'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function AdminLogin(){const [username,setU]=useState(''),[password,setP]=useState(''),[error,setE]=useState(''),[busy,setB]=useState(false);const router=useRouter();
 async function go(e:React.FormEvent){e.preventDefault();setB(true);setE('');const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});const d=await r.json();setB(false);if(!r.ok){setE(d.error||'Login failed');return}router.push('/admin')}
 return <main className="shell formwrap"><a className="brand" href="/">DRONEXMC</a><div className="panel" style={{marginTop:30}}><h1>Admin Login</h1><p className="muted">Sign in to review applications and configure webhooks.</p><form onSubmit={go}><label className="field"><span>Username</span><input required value={username} onChange={e=>setU(e.target.value)}/></label><label className="field"><span>Password</span><input required type="password" value={password} onChange={e=>setP(e.target.value)}/></label>{error&&<p className="error">{error}</p>}<button className="btn primary" disabled={busy}>{busy?'Signing in...':'Sign in'}</button></form></div></main>
}
