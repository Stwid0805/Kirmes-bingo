import React, { useState, useEffect } from 'react';
import { database, ref, set, onValue } from './firebaseConfig';
import './App.css';

const initialItems = [
  { text: "Ein Paar, das sich küsst", isMainTask: true },
  { text: "Jemand, der Popcorn isst", isMainTask: true },
  { text: "Eine Person mit Cowboy-Hut und einem Bier", isMainTask: true },
  { text: "Eine Gruppe, die Selfies macht und lacht", isMainTask: true },
  { text: "Ein Kind mit Zuckerwatte überall im Gesicht", isMainTask: true },
  "Jemand mit einem riesigen Stofftier",
  "Jemand mit einem Bier in jeder Hand",
  "Jemand, der eine Runde für alle ausgibt",
  "Ein Betrunkener, der einen Luftballon hält",
  "Ein Paar, das Händchen hält"
];

function App() {
  const [username, setUsername] = useState('');
  const [bingoCard, setBingoCard] = useState([]);
  const [progress, setProgress] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);
  const [customTask, setCustomTask] = useState('');

  useEffect(() => {
    // Initialisiere die Bingo-Karte mit den 5 Hauptaufgaben und 5 zufälligen Aufgaben
    const mainTasks = initialItems.slice(0, 5).map(item => ({
      text: typeof item === 'string' ? item : item.text,
      checked: false,
      isMainTask: true
    }));

    const otherTasks = initialItems.slice(5).sort(() => 0.5 - Math.random()).map(item => ({
      text: typeof item === 'string' ? item : item.text,
      checked: false,
      isMainTask: false
    }));

    setBingoCard([...mainTasks, ...otherTasks.slice(0, 5)]);

    // Listener für die Rangliste einrichten, um Updates in Echtzeit anzuzeigen
    const leaderboardRef = ref(database, 'leaderboard');
    onValue(leaderboardRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const sortedLeaderboard = Object.entries(data)
          .map(([name, { progress }]) => ({ name, progress }))
          .sort((a, b) => b.progress - a.progress);
        setLeaderboard(sortedLeaderboard);
      } else {
        setLeaderboard([]);
      }
    });
  }, []);

  const handleCheck = (index) => {
    if (!isNameSubmitted) {
      alert("Bitte gebe deinen Namen ein und klicke auf 'Start', bevor du fortfährst.");
      return;
    }

    const newCard = [...bingoCard];
    newCard[index].checked = !newCard[index].checked;
    setBingoCard(newCard);

    const newProgress = newCard.filter(item => item.checked).length;
    setProgress(newProgress);

    if (username) {
      set(ref(database, `leaderboard/${username}`), { progress: newProgress });
    }
  };

  const handleNameSubmit = () => {
    if (username.trim() === "") {
      alert("Bitte einen Namen eingeben.");
      return;
    }
    setIsNameSubmitted(true);
    set(ref(database, `leaderboard/${username}`), { progress: 0 });
  };

  const addCustomTask = () => {
    if (customTask.trim() === "") {
      alert("Bitte gib eine Aufgabe ein.");
      return;
    }

    const newCard = [...bingoCard, { text: customTask, checked: false, isMainTask: false }];
    setBingoCard(newCard);
    setCustomTask('');
  };

  const removeCustomTask = (index) => {
    const task = bingoCard[index];
    if (task.isMainTask) {
      alert("Hauptaufgaben können nicht gelöscht werden.");
      return;
    }

    const newCard = bingoCard.filter((_, i) => i !== index);
    setBingoCard(newCard);

    const newProgress = newCard.filter(item => item.checked).length;
    setProgress(newProgress);
    if (username) {
      set(ref(database, `leaderboard/${username}`), { progress: newProgress });
    }
  };

  return (
    <div className="App">
      <h1>Kirmes Bingo</h1>
      {!isNameSubmitted ? (
        <div>
          <input
            type="text"
            placeholder="Dein Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: "20px", padding: "10px", fontSize: "16px" }}
          />
          <button onClick={handleNameSubmit} style={{ padding: "10px 20px", fontSize: "16px" }}>
            Start
          </button>
        </div>
      ) : (
        <div>
          <h2>Hallo, {username}!</h2>
          <div className="bingo-card">
            {bingoCard.map((item, index) => (
              <div key={index} className="bingo-item-container">
                <div
                  className={`bingo-item ${item.checked ? 'checked' : ''}`}
                  onClick={() => handleCheck(index)}
                >
                  {item.text}
                </div>
                {!item.isMainTask && (
                  <button
                    className="delete-button"
                    onClick={() => removeCustomTask(index)}
                    style={{ marginLeft: "10px", padding: "5px" }}
                  >
                    Löschen
                  </button>
                )}
              </div>
            ))}
          </div>
          <h2>Fortschritt: {progress}/10</h2>

          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Eigene Bingo-Aufgabe hinzufügen"
              value={customTask}
              onChange={(e) => setCustomTask(e.target.value)}
              style={{ padding: "10px", fontSize: "16px", width: "70%" }}
            />
            <button onClick={addCustomTask} style={{ padding: "10px 20px", fontSize: "16px", marginLeft: "10px" }}>
              Aufgabe hinzufügen
            </button>
          </div>
        </div>
      )}
      <h3>Rangliste</h3>
      <ul className="leaderboard">
        {leaderboard.map(({ name, progress }, index) => (
          <li key={index}>{name}: {progress} Punkte</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
