import React, { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { format } from 'date-fns'

function saveEntries(data) {
  return localStorage.setItem('data', JSON.stringify(data))
}

function readEntries() {
  return JSON.parse(localStorage.getItem('data'))
}

function Input({ onSubmit }) {
  const [addingNew, setAddingNew] = useState(false)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const handleSumbit = e => {
    e.preventDefault()
    const { food, calories } = e.currentTarget.elements
    const convertedDate = new Date(date)
    convertedDate.setMinutes(
      convertedDate.getMinutes() + convertedDate.getTimezoneOffset()
    )
    onSubmit({
      food: food.value,
      calories: calories.value,
      date: convertedDate,
    })
    setAddingNew(false)
  }
  return !addingNew ? (
    <button onClick={() => setAddingNew(true)}>Add new</button>
  ) : (
    <form onSubmit={handleSumbit}>
      <div>
        <label htmlFor="food">Food</label>
        <input required type="text" id="food" name="food" />
      </div>
      <br />
      <div>
        <label htmlFor="calories">Calorie Count</label>
        <input required type="number" id="calories" name="calories" />
      </div>
      <br />
      <label htmlFor="date">Date</label>
      <input
        required
        type="date"
        id="date"
        name="date"
        onChange={e => setDate(e.target.value)}
        value={date}
      />
      <br />
      <button type="submit">submit</button>
    </form>
  )
}

const bucket = (xs, toKey) =>
  xs.reduce(
    (acc, x) => ({
      ...acc,
      [toKey(x)]: (acc[toKey(x)] || []).concat(x),
    }),
    {}
  )

function App() {
  const [entries, setEntries] = useState(readEntries() || [])
  const deleteEntry = id => {
    setEntries(entries => entries.filter(e => e.id !== id))
  }
  const addEntry = entry => {
    setEntries(entries => entries.concat(Object.assign(entry, { id: uuid() })))
  }
  useEffect(() => {
    saveEntries(entries)
  }, [entries])
  const entriesByDate = bucket(entries, entry => entry.date)
  return (
    <div className="App">
      {Object.entries(entriesByDate).map(([date, entries]) => (
        <React.Fragment key={date}>
          <h4>{new Date(date).toLocaleDateString()}</h4>
          <ul>
            {entries.map(({ food, calories, id }) => (
              <li key={id}>
                {food} ({calories}){' '}
                <button onClick={() => deleteEntry(id)}>X</button>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
      <Input onSubmit={addEntry} />
    </div>
  )
}

export default App
