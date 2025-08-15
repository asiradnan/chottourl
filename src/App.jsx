import { useEffect, useState } from 'react'
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
    const urlRegex = /^(https?:\/\/)?(www\.)?([\w.-]+)\.([a-zA-Z]{2,6})([\/\w.-]*)*\/?(\?[\w=&.-]*)?(#[\w-]*)?$/
    if (longUrl.match(urlRegex)) {
      setLoading(true)
      try {
        const response = await axios.post(
        "https://u.asiradnan.com/api/v1/shorten/",
        { "actual_url": longUrl }
      )
      setShortUrl("https://u.asiradnan.com/" + response.data.short_code)
      } 
      catch (error) {
        console.log(error)
      }
      finally{
        setLoading(false)
      }
    }
    else{
      console.log("Invalid url")
    }
  }

  return (
    <main>
      <h1 className='text-red-500'>CHOTTO URL</h1>
      
      <section>
        <input type="text" placeholder='https://example.com/a-long-url' value={longUrl} onChange={(e) => setLongUrl(e.target.value)}></input>
        <button onClick={shorten}>{isLoading ? "Shortening" : "Shorten"}</button>
        {shortUrl !== '' &&
          <p><a target="_blank" href={shortUrl}>{shortUrl}</a> </p>
        }
      </section>
      <section>
        Active Links: {stats.active_links}
        Total Links: {stats.total_links}
        Total Clicks: {stats.total_clicks}
      </section>
    </main>
  )
}

export default App
