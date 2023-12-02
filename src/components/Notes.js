import React, {useContext} from 'react'
import noteContext from "../context/notes/noteContext"
import Noteitem from './Noteitem';


const Notes = () => {
    const context = useContext(noteContext);
    // eslint-disable-next-line
    const {notes, setNotes} = context;
    return (
        <div className="row my-3">
            <h2>You Notes</h2> 
            {notes.map((note)=>{
                return <Noteitem key={note._id} note={note}/>  
            })}
            </div>
    )
}

export default Notes