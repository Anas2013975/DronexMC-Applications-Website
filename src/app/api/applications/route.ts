import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/questions';
import { encrypt, decrypt, safeAnswer, validWebhook } from '@/lib/security';

export async function GET() {
 const user=await currentUser(); if(!user) return NextResponse.json({error:'Login required'},{status:401});
 const db=supabase(); const {data,error}=await db.from('applications').select('id,ref_code,category,status,created_at').eq('discord_id',user.sub).order('created_at',{ascending:false});
 if(error) return NextResponse.json({error:'Could not load applications'},{status:500});
 return NextResponse.json({applications:data||[]});
}
export async function POST(req: NextRequest) {
 const user=await currentUser(); if(!user) return NextResponse.json({error:'Login required'},{status:401});
 let body:any; try{body=await req.json()}catch{return NextResponse.json({error:'Invalid JSON'},{status:400})}
 const category=String(body.category||''), language=body.language==='ar'?'ar':'en', answers=body.answers||{};
 const def=CATEGORIES.find(c=>c.key===category);
 if(!def) return NextResponse.json({error:'Invalid category'},{status:400});
 const minecraft=String(answers.minecraft||'').trim();
 if(!minecraft || minecraft.length>32) return NextResponse.json({error:language==='ar'?'اسم ماينكرافت مطلوب':'Minecraft username is required'},{status:400});
 const db=supabase();
 const {data:exists}=await db.from('applications').select('ref_code').eq('discord_id',user.sub).eq('category',category).maybeSingle();
 if(exists) return NextResponse.json({error:'Already applied',ref:exists.ref_code},{status:409});
 const ref='DX-'+new Date().getFullYear()+'-'+Math.random().toString(36).slice(2,8).toUpperCase();
 const {data:app,error}=await db.from('applications').insert({ref_code:ref,discord_id:user.sub,discord_username:user.username,discord_avatar:user.avatar||null,minecraft_username:minecraft,category,form_language:language}).select().single();
 if(error||!app) return NextResponse.json({error:'Could not save application'},{status:500});
 const rows=def.questions.map((q:any,i:number)=>({application_id:app.id,question_key:q.key,question_label:language==='ar'?q.ar:q.en,answer:safeAnswer(answers[q.key]||''),sort_order:i}));
 const {error:ansErr}=await db.from('application_answers').insert(rows);
 if(ansErr) return NextResponse.json({error:'Application saved but answers could not be saved. Contact staff.'},{status:500});
 // Notify category webhook if configured. Submission remains saved even if notification fails.
 try {
   const {data:setting}=await db.from('webhook_settings').select('encrypted_url').eq('category',category).maybeSingle();
   if(setting?.encrypted_url){
     const url=decrypt(setting.encrypted_url); if(validWebhook(url)){
       const lines=def.questions.map((q:any,i:number)=>`**${i+1}. ${language==='ar'?q.ar:q.en}**\n${safeAnswer(answers[q.key]||'—')}`).join('\n\n');
       const payload={allowed_mentions:{parse:[]},embeds:[{title:`DronexMC Application — ${def.en}`,color:0x22d3ee,description:`🎮 Discord Information\nUsername: ${user.username}\nID: ${user.sub}\nMention: <@${user.sub}>\nAvatar: ${user.avatar||'N/A'}\n\n----------------------------------------\n\n${lines}\n\n-------------------\n\n📋 General Information\nReference: ${ref}\nCategory: ${def.en}\nStatus: Under Review`,footer:{text:'DronexMC Applications'},timestamp:new Date().toISOString()}]};
       await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
     }
   }
 } catch {}
 return NextResponse.json({ok:true,ref});
}
