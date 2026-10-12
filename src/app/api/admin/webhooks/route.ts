import { NextRequest,NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { encrypt,validWebhook } from '@/lib/security';
const cats=['administration','media','development'];
export async function GET(){
 if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});
 const {data,error}=await supabase().from('webhook_settings').select('category,encrypted_url,notify_status');
 if(error)return NextResponse.json({error:'Database error'},{status:500});
 return NextResponse.json({settings:(data||[]).map(s=>({category:s.category,configured:!!s.encrypted_url,masked:s.encrypted_url?'••••••••••••':null,notify_status:s.notify_status}))});
}
export async function POST(req:NextRequest){
 if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});
 let b:any;try{b=await req.json()}catch{return NextResponse.json({error:'Invalid JSON'},{status:400})}
 if(!cats.includes(b.category))return NextResponse.json({error:'Invalid category'},{status:400});
 if(typeof b.notify_status==='boolean'){
  const {error}=await supabase().from('webhook_settings').upsert({category:b.category,notify_status:b.notify_status,updated_at:new Date().toISOString()},{onConflict:'category'});
  return error?NextResponse.json({error:'Save failed'},{status:500}):NextResponse.json({ok:true});
 }
 if(!validWebhook(String(b.url||'')))return NextResponse.json({error:'Invalid Discord webhook URL'},{status:400});
 const {data:old}=await supabase().from('webhook_settings').select('notify_status').eq('category',b.category).maybeSingle();
 const {error}=await supabase().from('webhook_settings').upsert({category:b.category,encrypted_url:encrypt(b.url),notify_status:old?.notify_status??true,updated_at:new Date().toISOString()},{onConflict:'category'});
 return error?NextResponse.json({error:'Save failed'},{status:500}):NextResponse.json({ok:true});
}
export async function DELETE(req:NextRequest){
 if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});
 const category=req.nextUrl.searchParams.get('category')||'';if(!cats.includes(category))return NextResponse.json({error:'Invalid category'},{status:400});
 const {error}=await supabase().from('webhook_settings').upsert({category,encrypted_url:null,updated_at:new Date().toISOString()},{onConflict:'category'});
 return error?NextResponse.json({error:'Delete failed'},{status:500}):NextResponse.json({ok:true});
}
