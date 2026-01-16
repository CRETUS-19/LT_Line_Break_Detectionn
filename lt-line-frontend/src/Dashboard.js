import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";
import MapView from "./MapView";

function Dashboard() {
  const [poles, setPoles] = useState({});

  useEffect(() => {
    const polesRef = ref(database, "poles");
    onValue(polesRef, (snapshot) => {
      setPoles(snapshot.val() || {});
    });
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Pole ID</th>
            <th>Voltage</th>
            <th>Current</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(poles).map(id => (
            <tr key={id}>
              <td>{id}</td>
              <td>{poles[id].voltage}</td>
              <td>{poles[id].current}</td>
              <td className={poles[id].status}>{poles[id].status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <MapView poles={poles} />
    </div>
  );
}

export default Dashboard;