import Button from "./components/Button";
import ProgressCircle from "./components/ProgressCircle";
import ControlButton from "./components/ControlButton";
import Container from "./components/Container";
import { useTimerState } from "./hooks/useTimerState"; 

function App() {
  const {
    status,
    setStatus,
    handleCancel,
    progressPercentage,
    currentDisplay,
    isRestTimeElapsed,
    isWorkingTimeElapsed,
  } = useTimerState();

  // El componente solo se encarga del renderizado
  return (
    <Container status={status}>
      <div className="flex flex-col items-center relative">
        <h1 className="text-5xl font-black uppercase">Yeux</h1>

        <p className="text-sm font-black uppercase bg-white px-2 py-1 rounded-full border-2 absolute -bottom-8 w-max mx-auto  inset-x-0">
          {status}
        </p>
      </div>
      <div className="border-2 rounded-full px-4 py-4  gap-6 inline-flex bg-white justify-center items-center">
        <ProgressCircle
          status={status}
          progressPercentage={progressPercentage}
        />
        <h2 className="text-6xl font-black text-center">{currentDisplay}</h2>
      </div>
      <div className="inline-flex items-center gap-4">
        <ControlButton
          status={status}
          setStatus={setStatus}
          isRestTimeElapsed={isRestTimeElapsed}
          isWorkingTimeElapsed={isWorkingTimeElapsed}
        />
        <Button
          onClick={handleCancel}
          className="bg-black text-white disabled:opacity-30 "
          hoverClassName="group-disabled:hidden"
          disabled={status === "cancelled"}
        >
          Cancel
        </Button>
      </div>
    </Container>
  );
}

export default App;