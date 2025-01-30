import { BrowserRouter as Router,Routes, Route } from "react-router-dom"
import CreatePoll from "./components/CreatePoll"
import GiveVote from "./components/GiveVote"
import LeaderBoard from "./components/LeaderBoard"
import Layout from "./components/Layout"

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LeaderBoard/>} />
          <Route path="/create-poll" element={<CreatePoll />} />
          <Route path="/poll/:id" element={<GiveVote />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
