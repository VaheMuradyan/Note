import {Container, Stack } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'

export const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "note-production.up.railway.app";

function App() {

  return (
    <Stack h="100vh">
      <Navbar />
      <Container>
        <NoteForm />
        <NoteList />
      </Container>
    </Stack>
  )
}

export default App
