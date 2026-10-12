'use client';
import { useEffect,useState } from 'react';
import { useParams,useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/questions';
export default function ApplyPage(){
 const params=useParams<{category:string}>(),router=useRouter();const cat=CATEGORIES.find(c=>c.key===params.category);
 const [lang,setLang]=useState<'en'|'ar'>('en'),[answers,setAnswers]=useState<Record<string,string>>({}),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';},[lang]);
 if(!cat)return <main className="shell formwrap"><h1>Application category not found</h1><Link href="/">Home</Link></main>;
 const ar=lang==='ar';
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');try{const r=await fetch('/api/applications',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({category:cat!.key,language:lang,answers})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Submission failed');router.push('/status/'+d.ref)}catch(e:any){setError(e.message||'Submission failed')}finally{setBusy(false)}}
 return <main className="shell formwrap"><div className="split"><Link className="brand" href="/">DRONEXMC</Link><button className="lang" onClick={()=>setLang(ar?'en':'ar')}>{ar?'English':'العربية'}</button></div><div className="panel"><span className="tag">{cat.key}</span><h1>{ar?cat.ar:cat.en}</h1><p className="muted">{ar?'اختر لغة النموذج ثم أجب عن جميع الأسئلة المطلوبة. يلزم تسجيل الدخول عبر Discord.':'Choose the form language and answer the required questions. Discord login is required.'}</p><form onSubmit={submit}><label className="field"><span>{ar?'اسم Minecraft':'Minecraft username'} *</span><input required value={answers.minecraft||''} onChange={e=>setAnswers({...answers,minecraft:e.target.value})} maxLength={32}/></label>{cat.questions.filter(q=>q.key!=='minecraft').map(q=><label className="field" key={q.key}><span>{ar?q.ar:q.en}{q.required===false?'':' *'}</span>{q.type==='textarea'?<textarea required value={answers[q.key]||''} onChange={e=>setAnswers({...answers,[q.key]:e.target.value})}/>:<input required type={q.type==='number'?'number':q.type==='url'?'url':'text'} value={answers[q.key]||''} onChange={e=>setAnswers({...answers,[q.key]:e.target.value})}/>}</label>)}{error&&<p className="error">{error}</p>}<div className="actions"><button className="btn primary" disabled={busy}>{busy?(ar?'جارٍ الإرسال...':'Submitting...'):(ar?'إرسال التقديم':'Submit Application')}</button><Link className="btn" href="/dashboard">{ar?'لوحتي':'Dashboard'}</Link></div></form></div></main>
}
