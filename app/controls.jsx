'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { noop } from './actions'

export function Controls() {
  const router = useRouter()
  const params = useSearchParams()

  return (
    <div style={{ position: 'fixed', top: 8, right: 8, background: '#fff', padding: 8, border: '1px solid #000' }}>
      <div>?open = {params.get('open') ?? '(none)'}</div>
      <button
        id="open"
        onClick={() => {
          // The documented "native History API" pattern:
          // https://nextjs.org/docs/app/getting-started/linking-and-navigating#using-the-native-history-api
          window.history.replaceState(null, '', '?open=1')
        }}
      >
        1. history.replaceState('?open=1')
      </button>
      <button id="refresh" onClick={() => router.refresh()}>
        2. router.refresh()
      </button>
      <button
        id="mutate"
        onClick={async () => {
          await noop()
          router.refresh()
        }}
      >
        2b. server action + router.refresh()
      </button>
    </div>
  )
}
