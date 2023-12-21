import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import styled from "styled-components";
import { TimerProvider } from './context/TimerContext';
import DocumentationView from "./views/DocumentationView/DocumentationView";
import TimersView from "./views/TimersView/TimersView";
import AddTimerView from "./views/AddTimersView/AddTimersView";
import WorkoutQueueView from "./views/WorkoutQueueView/WorkoutQueueView";
import WorkoutHistoryView from "./views/WorkoutHistoryView/WorkoutHistoryView";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ErrorBoundary } from 'react-error-boundary';
import Button from "./components/generic/Button/Button";
import './App.css';

const Container = styled.div`
  height: 100vh;
  overflow: auto;
`;

const Nav = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Workout</Link>
        </li>
        <li>
          <Link to="/add">Add Timer</Link>
        </li>
        <li>
          <Link to="/history">History</Link>
        </li>
        <li>
          <Link to="/timers">Timers</Link>
        </li>
        <li>
          <Link to="/docs">Documentation</Link>
        </li>
      </ul>
    </nav>
  );
};

//ErrorFallback component to display when an error occurs
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert">
    <p>Something went wrong</p>
    <pre>{error.message}</pre>
    <Button label="Please try again" onClick={resetErrorBoundary} />
  </div>
);

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => { window.location.reload() }}>
      <TimerProvider>
        <DndProvider backend={HTML5Backend}>
          <Container>
            <Router>
              <Nav />
              <Routes>
                <Route path="/" element={<WorkoutQueueView />} />
                <Route path="/add" element={<AddTimerView />} />
                <Route path="/timers" element={<TimersView />} />
                <Route path="/history" element={<WorkoutHistoryView />} />
                <Route path="/docs" element={<DocumentationView />} />
              </Routes>
            </Router>
          </Container>
        </DndProvider>
      </TimerProvider>
    </ErrorBoundary>
  );
};

export default App;