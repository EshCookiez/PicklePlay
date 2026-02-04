import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirection URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
        console.error('Auth callback exchange error:', error)
    } else {
        console.warn('Auth callback: no code found in URL')
    }

    // Capture error details from URL if present
    const error = searchParams.get('error')
    const error_description = searchParams.get('error_description')
    const errorUrl = new URL(`${origin}/auth/auth-code-error`)
    if (error) errorUrl.searchParams.set('error', error)
    if (error_description) errorUrl.searchParams.set('error_description', error_description)

    return NextResponse.redirect(errorUrl.toString())
}
