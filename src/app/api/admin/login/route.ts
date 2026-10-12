import { NextRequest, NextResponse } from 'next/server';
import { makeToken } from '@/lib/auth';
export async function POST(req:NextRequest){
 let b:any;try{b=await req.json()}catch{return NextResponse.json({error:'Invalid request'},{status:400})}
 if(!process.env.ADMIN_USERNAME||!process.env.ADMIN_PASSWORD)return NextResponse.json({error:'Admin credentials are not configured'},{status:503});
 if(b.username!==process.env.ADMIN_USERNAME||b.password!==process.env.ADMIN_PASSWORD)return NextResponse.json({error:'Incorrect username or password'},{status:401});
 const token=await makeToken({admin:true,username:b.username},'admin');
 const res=NextResponse.json({ok:true});res.cookies.set('dx_admin',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:28800});return res;
}
