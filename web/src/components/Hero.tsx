import Image from 'next/image'
import Link from 'next/link'
import nlwLogo from '../assets/nlw-spacetime-logo.svg'

export function Hero() {
  return (
    <div className="space-y-5">
      <div>
        <Image src={nlwLogo} alt="Logo do NLW" />
      </div>

      <div className="space-y-1">
        <h1 className="text-5xl font-bold leading-tight text-gray-50">
          Sua cápsula do Tempo
        </h1>
        <p className="max-w-[420px] text-lg">
          Colecione momentos marcantes da sua jornada e compartilhe (se quiser)
          com o mundo!
        </p>
      </div>
      <Link
        href="/memories/new"
        className="inline-block rounded-full bg-green-500 px-5 py-3 font-alt text-sm font-bold uppercase leading-none text-black hover:bg-green-600"
      >
        Cadastrar Lembrança
      </Link>
    </div>
  )
}
