import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
export async function GET(req: NextRequest) {
 const id=process.env.DISCORD_CLIENT_ID, redirect=process.env.DISCORD_REDIRECT_URI;
 if(!id||!redirect) return NextResponse.json({error:'Discord OAuth is not configured. Set DISCORD_CLIENT_ID and DISCORD_REDIRECT_URI.'},{status:503});
 const state=randomBytes(24).toString('hex');
 const target=new URL('https://discord.com/oauth2/authorize');
 target.searchParams.set('client_id',id); target.searchParams.set('redirect_uri',redirect);
 target.searchParams.set('response_type','code'); target.searchParams.set('scope','identify'); target.searchParams.set('state',state);
 const res=NextResponse.redirect(target);
 res.cookies.set('dx_oauth_state',state,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:600});
 const next=req.nextUrl.searchParams.get('next');
 if(next && next.startsWith('/')) res.cookies.set('dx_oauth_next',next,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:600});
 return res;
}
