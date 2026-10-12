import { NextRequest,NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
export async function POST(req:NextRequest){
 if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});
 let b:any;try{b=await req.json()}catch{return NextResponse.json({error:'Invalid JSON'},{status:400})}
 if(!b.application_id||!String(b.note||'').trim())return NextResponse.json({error:'Note required'},{status:400});
 const {error}=await supabase().from('admin_notes').insert({application_id:b.application_id,author:process.env.ADMIN_USERNAME||'admin',note:String(b.note).slice(0,2000)});
 return error?NextResponse.json({error:'Could not save note'},{status:500}):NextResponse.json({ok:true});
}
