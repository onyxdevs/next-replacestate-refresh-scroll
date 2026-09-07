import { Controls } from './controls'

export const dynamic = 'force-dynamic'

export default function Page({ searchParams }) {
  return (
    <main>
      <h1 id="top">replaceState + refresh scroll repro</h1>
      <Controls />
      <p>Rendered at {new Date().toISOString()}</p>
      <div style={{ height: '300vh', background: 'linear-gradient(#eee, #999)' }} />
      <p id="bottom">bottom</p>
    </main>
  )
}
