import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial)

  // Get all Notes
  const getNotes = async () => {
    // API Call 
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU2YjFiMmZmMTQ0MDVhZWE1Njc5NzE3In0sImlhdCI6MTcwMTUxODE2NH0.RF-TLE9qwJ4fnDC8-bAArQhAGsucODxNmP19U7I9ijA"
      }
    });
    const json = await response.json()
    console.log(json)
    setNotes(json)
  }

  // Add a Note
  const addNote = async (title, description, tag) => {
    // TODO: API Call
    // API Call 
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU2YjFiMmZmMTQ0MDVhZWE1Njc5NzE3In0sImlhdCI6MTcwMTUxODE2NH0.RF-TLE9qwJ4fnDC8-bAArQhAGsucODxNmP19U7I9ijA"
     },
      body: JSON.stringify({title, description, tag})
    });
     
    const json = await response.json();
    console.log(json);

    console.log("Adding a new note")
    const note = {
      "_id": "656c474ec762309e1eeaa8a4",
      "user": "656b1b2ff14405aea5679717",
      "title": title,
      "description": description,
      "tag": tag,
      "date": "2021-09-03T14:20:09.668Z",
      "__v": 0
    };
    setNotes(notes.concat(note))
  }

  // Delete a Note
  const deleteNote = async (id) => {
    // TODO: API Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU2YjFiMmZmMTQ0MDVhZWE1Njc5NzE3In0sImlhdCI6MTcwMTUxODE2NH0.RF-TLE9qwJ4fnDC8-bAArQhAGsucODxNmP19U7I9ijA"
     },
    });
    // eslint-disable-next-line
    const json = response.json();
    console.log(json)


    console.log("Deleting the note with id" + id);
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes)
  }
  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    // API Call 
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU2YjFiMmZmMTQ0MDVhZWE1Njc5NzE3In0sImlhdCI6MTcwMTUxODE2NH0.RF-TLE9qwJ4fnDC8-bAArQhAGsucODxNmP19U7I9ijA"
     },
      body: JSON.stringify({title, description, tag})
    });

    const json = await response.json();
    console.log(json);

   
    let newNotes = JSON.parse(JSON.stringify(notes))
    // Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag; 
        break; 
      }
    }  
    setNotes(newNotes);
  }

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )

}
export default NoteState;