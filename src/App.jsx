import { useEffect, useState } from 'react'
import axios from 'axios'
import { Copy, ExternalLink, Github } from 'lucide-react'

function App() {
  const [isLoading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    active_links: "loading",
    total_links: "loading",
    total_clicks: "loading"
  })
  const [shortUrl, setShortUrl] = useState('')
  const [longUrl, setLongUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

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

  useEffect(() => {
    fetchStats()
  }, [])

  async function shorten() {
    setError('')
    const urlRegex = /^(https?:\/\/)?(www\.)?([\w.-]+)\.([a-zA-Z]{2,6})([\/\w.-]*)*\/?(\?[\w=&.-]*)?(#[\w-]*)?$/
    if (longUrl.match(urlRegex)) {
      setLoading(true)
      try {
        const response = await axios.post(
          "https://u.asiradnan.com/api/v1/shorten/",
          { "actual_url": longUrl }
        )
        console.log(response)
        setShortUrl("https://u.asiradnan.com/" + response.data.short_code)
        await fetchStats()
      }
      catch (error) {
        console.log(error)
        setError('FAILED TO SHORTEN URL')
      }
      finally {
        setLoading(false)
      }
    }
    else {
      setError('INVALID URL FORMAT')
    }
  }

  const copyToClipboard = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background geometric elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border-4 border-yellow-400 rotate-12"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-red-500 rotate-45"></div>
        <div className="absolute bottom-32 left-20 w-40 h-2 bg-blue-500"></div>
        <div className="absolute bottom-40 right-32 w-2 h-32 bg-yellow-400"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/10 rotate-45"></div>
      </div>

      <main className="relative z-10 min-h-screen flex flex-col justify-between p-6 md:p-12">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="text-xs uppercase tracking-widest text-white/60">
            URL Shortener / V2.0
          </div>
          <a 
            href="https://github.com/asiradnan/chottourl" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-yellow-400 transition-colors group"
          >
            <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="text-xs uppercase tracking-widest">Source</span>
          </a>
        </div>

        {/* Main Title */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-4xl">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter mb-8">
              CHO
              <span className="inline-block transform -rotate-12 text-yellow-400">TTO</span>
              <br />
              <span className="text-red-500">URL</span>
            </h1>
            <div className="w-full max-w-2xl mx-auto space-y-6">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="PASTE YOUR LONG URL HERE"
                  value={longUrl} 
                  onChange={(e) => setLongUrl(e.target.value)}
                  className={`w-full bg-transparent border-2 ${error ? 'border-red-500' : 'border-white'} text-white placeholder-white/50 px-6 py-4 text-lg focus:outline-none focus:border-yellow-400 transition-colors uppercase tracking-wide font-mono`}
                />
                <div className="absolute -right-2 -bottom-2 w-4 h-4 bg-red-500"></div>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border-2 border-red-500 p-4 relative">
                  <div className="text-red-500 font-black text-lg uppercase tracking-wider text-center">
                    {error}
                  </div>
                  <div className="absolute -left-2 -top-2 w-4 h-4 bg-red-500"></div>
                  <div className="absolute -right-2 -bottom-2 w-4 h-4 bg-red-500"></div>
                </div>
              )}

              <button 
                onClick={shorten}
                disabled={isLoading}
                className="w-full bg-white text-black py-4 px-6 font-black text-xl uppercase tracking-wider hover:bg-yellow-400 hover:text-black transition-all duration-300 transform hover:scale-105 disabled:opacity-50 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isLoading ? "SHORTENING..." : "SHORTEN"}
                </span>
                <div className="absolute inset-0 bg-red-500 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </button>

              {shortUrl && (
                <div className="bg-white/5 border border-white/20 p-6 relative">
                  <div className="flex items-center justify-between gap-4">
                    <a 
                      href={shortUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 text-yellow-400 hover:text-white transition-colors font-mono text-lg break-all"
                    >
                      {shortUrl}
                    </a>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-white/10 transition-colors group relative"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-5 h-5" />
                        {copied && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-green-500 text-black px-2 py-1 rounded">
                            COPIED!
                          </span>
                        )}
                      </button>
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/10 transition-colors"
                        title="Open link"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                  <div className="absolute -left-2 -top-2 w-4 h-4 bg-blue-500"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="relative">
            <div className="text-4xl md:text-6xl font-black text-yellow-400">
              {stats.active_links}
            </div>
            <div className="text-xs uppercase tracking-widest text-white/60 mt-2">
              Active Links
            </div>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400"></div>
          </div>
          
          <div className="relative">
            <div className="text-4xl md:text-6xl font-black text-red-500">
              {stats.total_links}
            </div>
            <div className="text-xs uppercase tracking-widest text-white/60 mt-2">
              Total Links
            </div>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500"></div>
          </div>
          
          <div className="relative">
            <div className="text-4xl md:text-6xl font-black text-blue-500">
              {stats.total_clicks}
            </div>
            <div className="text-xs uppercase tracking-widest text-white/60 mt-2">
              Total Clicks
            </div>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-500"></div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App