import { useRouter } from 'next/router'
import useSwr from 'swr'

const fetcher = (url : string) => fetch(url).then((res) => res.json())

export default function Pin() {
  const router = useRouter()
  const { data, error } = useSwr(
    router.query.id ? `/api/pin/${router.query.id}` : null,
    fetcher
  )

  if (error) return <div>Failed to load pin</div>
  if (!data) return <div>Loading...</div>

  return <div>{data.name}</div>
}