import {Container, Stack } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'

export const BASE_URL = "http://localhost:5000/api";

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
