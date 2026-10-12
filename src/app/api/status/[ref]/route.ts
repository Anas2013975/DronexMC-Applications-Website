import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
export async function GET(_:Request,{params}:{params:{ref:string}}){
 const user=await currentUser(); if(!user)return NextResponse.json({error:'Login required'},{status:401});
 const db=supabase(); const {data:app,error}=await db.from('applications').select('*').eq('ref_code',params.ref).eq('discord_id',user.sub).maybeSingle();
 if(error||!app)return NextResponse.json({error:'Not found'},{status:404});
 const {data:answers}=await db.from('application_answers').select('question_label,answer,sort_order').eq('application_id',app.id).order('sort_order');
 return NextResponse.json({application:app,answers:answers||[]});
}
