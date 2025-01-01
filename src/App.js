import React from "react";
import TodoApp from "./Components/TodoApp";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  return (
    <div className="App">
      <SpeedInsights />
      <TodoApp />
    </div>
  );
}

export default App;
