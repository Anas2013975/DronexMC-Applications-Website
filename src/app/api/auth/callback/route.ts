import { NextRequest, NextResponse } from 'next/server';
import { makeToken } from '@/lib/auth';
export async function GET(req: NextRequest) {
 const code=req.nextUrl.searchParams.get('code'), state=req.nextUrl.searchParams.get('state');
 const stored=req.cookies.get('dx_oauth_state')?.value;
 if(!code||!state||!stored||state!==stored) return NextResponse.redirect(new URL('/?auth=failed',req.url));
 const id=process.env.DISCORD_CLIENT_ID, secret=process.env.DISCORD_CLIENT_SECRET, redirect=process.env.DISCORD_REDIRECT_URI;
 if(!id||!secret||!redirect) return NextResponse.json({error:'OAuth environment variables are missing'},{status:503});
 try {
  const tokenRes=await fetch('https://discord.com/api/oauth2/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:id,client_secret:secret,grant_type:'authorization_code',code,redirect_uri:redirect})});
  const token=await tokenRes.json(); if(!tokenRes.ok) throw new Error('Discord token exchange failed');
  const userRes=await fetch('https://discord.com/api/users/@me',{headers:{Authorization:`Bearer ${token.access_token}`}});
  const u=await userRes.json(); if(!userRes.ok) throw new Error('Discord profile request failed');
  const avatar=u.avatar?`https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128`:'';
  const session=await makeToken({sub:String(u.id),username:String(u.username),name:String(u.global_name||u.username),avatar},'user');
  const next=req.cookies.get('dx_oauth_next')?.value||'/dashboard';
  const res=NextResponse.redirect(new URL(next,req.url));
  res.cookies.set('dx_session',session,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:604800});
  res.cookies.delete('dx_oauth_state');res.cookies.delete('dx_oauth_next');return res;
 } catch { return NextResponse.redirect(new URL('/?auth=failed',req.url)); }
}
