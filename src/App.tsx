import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChildrenResponse,
  getChildren,
  getNextFriday,
  isRelevantDate,
} from "./api";
import {
  AddButton,
  ListItem,
  ListTitle,
  MayaCard,
  ParentDialog,
} from "./components";
import { AppContext, ChildId } from "./context";
import { storage } from "./storage";
import {
  Alert,
  Button,
  CircularProgress,
  List,
  Snackbar,
  Typography,
} from "@mui/material";
import "./App.css";
import { usePolling } from "./hooks";

function App() {
  const [data, setData] = useState<ChildrenResponse[]>([]);
  const [childId, setChildId] = useState<ChildId>(storage.get());
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const handleUpdateSchedule = useCallback(
    (id: number, errorMessage?: string) => {
      const schedule = getNextFriday().toString();
      if (errorMessage) setErrorMessage(errorMessage);
      setData((prev) =>
        prev.map((child) => {
          const isScheduled = isRelevantDate(child.schedule);
          return child.id === id
            ? { ...child, schedule: isScheduled ? undefined : schedule }
            : child;
        })
      );
    },
    []
  );

  const resetChild = useCallback(() => {
    setChildId(null);
  }, []);

  const fetchChildren = useCallback(async () => {
    try {
      const response = await getChildren();
      setData(response);
    } finally {
      setLoading(false);
    }
  }, []);

  usePolling(fetchChildren);

  useEffect(() => {
    if (childId) storage.set(childId);
    else storage.reset();
  }, [childId]);

  const [scheduled, [unscheduled]] = useMemo(
    () =>
      data
        .filter((child) => child.id !== -1)
        .reduce(
          (prev: [ChildrenResponse[], ChildrenResponse[]], child) => {
            if (isRelevantDate(child.schedule)) prev[0].push(child);
            else if (childId === child.id) prev[1].push(child);
            // else prev[1].push(curr);
            return prev;
          },
          [[], []]
        ),
    [childId, data]
  );

  const childName = useMemo(() => {
    if (childId === -1) return "מאיה הגננת";
    const child = data.find((item) => item.id === childId);
    if (child) return `הורים של ${child.name}`;
    return "";
  }, [childId, data]);

  const maya = useMemo(() => data.find((item) => item.id === -1), [data]);

  return (
    <AppContext.Provider value={{ childId, setChildId }}>
      {loading ? (
        <CircularProgress size={60} />
      ) : (
        <div className="main-wrapper">
          <div className="top-container">
            {childName && (
              <Typography variant="h6">שלום ל{childName} 👋</Typography>
            )}
            <ListTitle scheduled={scheduled} />
            <MayaCard data={maya} />
            {unscheduled && (
              <AddButton data={unscheduled} onUpdate={handleUpdateSchedule} />
            )}
            {childId === -1 ? (
              <AddButton data={maya!} onUpdate={handleUpdateSchedule} />
            ) : (
              <></>
            )}
            {scheduled.length > 0 && (
              <Typography variant="body1">מי נרשמו?</Typography>
            )}
          </div>
          <List className="children-list">
            {scheduled.map((child) => (
              <ListItem
                key={child.id}
                data={child}
                onUpdate={handleUpdateSchedule}
              />
            ))}
          </List>
          {childId && (
            <div className="bottom-container">
              <Button variant="outlined" color="secondary" onClick={resetChild}>
                {maya?.id === childId
                  ? "אני לא מאיה הגננת"
                  : `אנחנו לא ה${childName}`}
              </Button>
            </div>
          )}
        </div>
      )}

      <ParentDialog data={data} />
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={10000}
        onClose={() => setErrorMessage("")}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  );
}

export default App;
