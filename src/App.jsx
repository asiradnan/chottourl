import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [isLoading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    "active_links": "loading",
    "total_links": "loading",
    "total_clicks": "loading"
  })
  const [shortUrl, setShortUrl] = useState('')
  const [longUrl, setLongUrl] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const response = await axios.get("https://u.asiradnan.com/api/v1/stats")
        setStats(response.data)
        console.log(response.data)
      }
      catch (error) {
        console.log(error)
      }
      finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  async function shorten() {
    // if (longUrl)
    const response = await axios.post("https://u.asiradnan.com/api/v1/shorten/",
      {"actual_url": longUrl}
    )
    console.log(response.data)
    // setShortUrl(response)
  }

  return (
    <>
      <h1>CHOTTO URL</h1>
      {isLoading ? <h1>Loading</h1> : <h1>Not loading</h1>}
      <section>
        <input type="link" placeholder='https://example.com/a-long-url' value={longUrl} onChange={(e) => setLongUrl(e.target.value)}></input>
        <button onClick={shorten}>Shorten</button>
        {/* <p>{short_url}</p> */}
      </section>
      <section>
        Active Links: {stats.active_links}
        Total Links: {stats.total_links}
        Total Clicks: {stats.total_clicks}
      </section>
    </>
  )
}

export default App
