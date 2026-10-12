'use client';
import { useEffect, useState } from 'react';
import { CATEGORIES } from '@/lib/questions';

export default function Home() {
 const [lang,setLang]=useState<'en'|'ar'>('en'); const [user,setUser]=useState<any>(null);
 useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';fetch('/api/me').then(r=>r.ok?r.json():null).then(d=>setUser(d?.user||null)).catch(()=>{});},[lang]);
 const ar=lang==='ar';
 return <><header className="shell nav"><a className="brand" href="/">DRONEXMC</a><nav className="navlinks"><a href="#applications">{ar?'التقديمات':'Applications'}</a><a href="/dashboard">{ar?'لوحتي':'Dashboard'}</a>{user?<span>{user.username}</span>:<a className="btn" href="/api/auth/login">{ar?'دخول Discord':'Login with Discord'}</a>}<button className="lang" onClick={()=>setLang(ar?'en':'ar')}>{ar?'English':'العربية'}</button></nav></header>
 <main><section className="hero shell"><span className="eyebrow">{ar?'انضم إلى فريقنا':'DronexMC Network'}</span><h1>{ar?'ابنِ مستقبل DronexMC معنا':'Join the DronexMC Team'}</h1><p>{ar?'قدّم للانضمام إلى فريق الإدارة أو الإعلام أو التطوير. اختر لغتك وأكمل طلبك بعد تسجيل الدخول بديسكورد.':'Apply to join our Administration, Media, or Development team. Choose your language and complete your application after Discord login.'}</p><div className="actions"><a className="btn primary" href="#applications">{ar?'ابدأ التقديم':'Explore Applications'}</a><a className="btn" href="https://discord.com" target="_blank" rel="noreferrer">{ar?'مجتمع Discord':'Join Discord'}</a></div></section>
 <section className="section shell" id="applications"><div className="sectionhead"><h2>{ar?'اختر فريقك':'Choose Your Team'}</h2><p>{ar?'كل حساب يمكنه التقديم مرة واحدة لكل فئة.':'One application per Discord account in each category.'}</p></div><div className="grid">{CATEGORIES.map(c=><article className="card" key={c.key}><span className="tag">{c.key}</span><h3>{ar?c.ar:c.en}</h3><p>{ar?c.descriptionAr:c.descriptionEn}</p><a className="btn primary" href={user?`/apply/${c.key}`:'/api/auth/login'}>{ar?'قدّم الآن':'Apply Now'} ↗</a></article>)}</div></section>
 <section className="section shell"><div className="panel"><h2>{ar?'كيف تعمل العملية؟':'How it works'}</h2><p className="muted">{ar?'1. سجّل دخولك عبر Discord. 2. اختر الفئة واللغة. 3. أرسل إجاباتك وتابع الحالة من لوحة التحكم.':'1. Sign in with Discord. 2. Choose a category and language. 3. Submit your answers and track the status from your dashboard.'}</p></div></section></main>
 <footer className="footer"><div className="shell split"><span>© {new Date().getFullYear()} DronexMC</span><span>{ar?'بوابة التقديم الرسمية':'Staff Application Portal'}</span><a href="/admin/login">Admin</a></div></footer></>;
}
