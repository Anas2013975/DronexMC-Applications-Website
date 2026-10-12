'use client';
import { useParams } from 'next/navigation';
import { useEffect,useState } from 'react';
import Link from 'next/link';
export default function StatusPage(){const p=useParams<{ref:string}>();const [data,setData]=useState<any>(null),[error,setError]=useState('');
 useEffect(()=>{fetch('/api/status/'+p.ref).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||'Not found');setData(d)}).catch(e=>setError(e.message))},[p.ref]);
 return <main className="shell formwrap"><a className="brand" href="/">DRONEXMC</a><h1>Application Status</h1>{error&&<div className="notice">{error}. <Link href="/api/auth/login?next=/dashboard">Login with Discord</Link></div>}{data&&<><div className="panel"><div className="split"><div><span className="tag">{data.application.category}</span><h2>{data.application.ref_code}</h2></div><span className={'badge '+data.application.status}>{data.application.status}</span></div><p className="muted">Submitted {new Date(data.application.created_at).toLocaleString()}</p></div><section className="section"><h2>Answers</h2>{data.answers.map((a:any,i:number)=><div className="card" key={i}><strong>{a.question_label}</strong><p>{a.answer||'—'}</p></div>)}</section></>}<Link className="btn" href="/dashboard">Dashboard</Link></main>
}
