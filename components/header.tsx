import { ChevronRight, Droplets, LogOut } from "lucide-react"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ModeToggle } from '@/components/dropdown'
import { useSession, signIn, signOut, getCsrfToken } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import '@particle-network/connect-react-ui/dist/index.css'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { SigninMessage } from "@/utils/SigninMessage"
import bs58 from 'bs58'

export default function Header() {
  const router = useRouter()
  const { data: session } = useSession()
  const pathname = usePathname()

  const { publicKey, signMessage } = useWallet()

  useEffect(() => {
    console.log('publicKey:', publicKey?.toBase58())
  }, [publicKey])

  useEffect(() => {
    console.log('publicKey:', publicKey?.toBase58())
    const handleAuthFlow = async () => {
      console.log('fucking session:', session)
      
      if (publicKey && !session) {
        const response = await fetch(`/api/user/${publicKey.toBase58()}`)
        console.log('fucking response:', response)

        if (response.ok) {
          const csrf = await getCsrfToken()
          if (!csrf || !signMessage) return

          const message = new SigninMessage({
            domain: window.location.host,
            publicKey: publicKey.toBase58(),
            statement: `Sign this message to sign in to AIVerse.`,
            nonce: csrf
          });

          const data = new TextEncoder().encode(message.prepare());
          const signature = await signMessage(data);
          const serializedSignature = bs58.encode(signature);

          signIn('credentials', { 
            address: publicKey.toBase58(),
            redirect: false,
            callbackUrl: '/'
          })
        } else {  
          router.push('/signup')
        }
      } else if (!publicKey && session) {
        signOut({ redirect: false })
      }
    }

    handleAuthFlow()
  }, [publicKey, session, router])

  return (
    <nav className='border-b flex flex-col sm:flex-row items-start sm:items-center sm:pr-10'>
      <div className='py-3 px-8 flex flex-1 items-center'>
        <Link href="/" className='mr-5 flex items-center'>
          <Droplets className="opacity-85" size={19} />
          <p className={`ml-2 mr-4 text-lg font-semibold`}>xocial</p>
        </Link>
        <Link href="/" className={`mr-5 text-sm ${pathname !== '/' && 'opacity-50'}`}>
          <p>Home</p>
        </Link>
      </div>
      <div className='flex sm:items-center pl-8 pb-3 sm:p-0 gap-2'>
        <WalletMultiButton />
        <ModeToggle />
      </div>
    </nav>
  )
}
// 