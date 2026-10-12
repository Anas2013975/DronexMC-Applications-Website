import { NextRequest,NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
export async function GET(req:NextRequest){
 if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});
 const db=supabase(), q=req.nextUrl.searchParams.get('q')||'', status=req.nextUrl.searchParams.get('status')||'', category=req.nextUrl.searchParams.get('category')||'';
 let query=db.from('applications').select('*').order('created_at',{ascending:false}).limit(200);
 if(status)query=query.eq('status',status);if(category)query=query.eq('category',category);
 const {data,error}=await query;if(error)return NextResponse.json({error:'Database error'},{status:500});
 const filtered=(data||[]).filter(a=>!q||[a.discord_username,a.discord_id,a.minecraft_username,a.ref_code].some(v=>String(v||'').toLowerCase().includes(q.toLowerCase())));
 return NextResponse.json({applications:filtered});
}
export async function PATCH(req:NextRequest){
 if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});
 let b:any;try{b=await req.json()}catch{return NextResponse.json({error:'Invalid JSON'},{status:400})}
 if(!['Under Review','Accepted','Rejected'].includes(b.status))return NextResponse.json({error:'Invalid status'},{status:400});
 const db=supabase();const {error}=await db.from('applications').update({status:b.status,updated_at:new Date().toISOString()}).eq('id',b.id);
 if(error)return NextResponse.json({error:'Update failed'},{status:500});return NextResponse.json({ok:true});
}
