import { useEffect, useState } from "react"

function countWords(text: string) {
  const cleanedText = text.trim()

  if (cleanedText === "") {
    return 0
  }

  return cleanedText.split(/\s+/).length
}

function App() {
  const [wordCount, setWordCount] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function updateWordCount() {
    setErrorMessage(null)

    try {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true })

      if (!activeTab.id) {
        throw new Error("No active tab found")
      }

      const [{ result: pageText }] = await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => document.body?.innerText ?? "",
      })

      setWordCount(countWords(pageText ?? ""))
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to read the page")
    }
  }

  useEffect(() => {
    void updateWordCount()

    const intervalId = window.setInterval(() => {
      void updateWordCount()
    }, 2000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return (
    <div className="p-4 text-sm text-muted-foreground">
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : wordCount === null ? (
        <p>Counting words...</p>
      ) : (
        <p>
          Word count: <span className="font-medium text-foreground">{wordCount}</span>
        </p>
      )}
    </div>
  )
}

export default App
