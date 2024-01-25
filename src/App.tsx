import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChildrenResponse,
  Metadata,
  defaultMetadata,
  getChildren,
  getMetadata,
  getNextFriday,
  isRelevantDate,
} from "./api";
import {
  AddButton,
  AppFooter,
  ListItem,
  ListTitle,
  ParentDialog,
  TeacherCard,
} from "./components";
import { AppContext, ChildId } from "./context";
import { storage } from "./storage";
import {
  Alert,
  CircularProgress,
  List,
  Snackbar,
  Typography,
} from "@mui/material";
import { usePolling } from "./hooks";
import "./App.css";
import { setNotificationTitle } from "./general";

function App() {
  const [data, setData] = useState<ChildrenResponse[]>([]);
  const [childId, setChildId] = useState<ChildId>(storage.get());
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [{ teacherId, lastUpdate }, setMetadata] =
    useState<Metadata>(defaultMetadata);

  const teacher = useMemo(
    () => data.find((item) => item.id === teacherId),
    [data]
  );

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

  const fetchChildren = useCallback(async () => {
    try {
      const response = await getChildren();
      setData(response);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMetadata = useCallback(
    async (isPolling = true) => {
      const response = await getMetadata(isPolling);
      if (isPolling) {
        const { lastChildrenUpdate } = response;
        if (
          lastUpdate &&
          lastUpdate < response.lastUpdate &&
          lastChildrenUpdate !== childId
        ) {
          setMetadata((prev) => ({ ...prev, ...response }));
          if (teacher?.id === lastChildrenUpdate)
            setNotificationTitle(teacher?.name);
          fetchChildren();
        }
      } else {
        setMetadata(response as Metadata);
      }
    },
    [lastUpdate, childId, teacher?.id, teacher?.name]
  );

  useEffect(() => {
    fetchMetadata(false).then(fetchChildren);
  }, []);

  useEffect(() => {
    if (childId) storage.set(childId);
    else storage.reset();
  }, [childId]);

  usePolling(fetchMetadata, { fireOnMount: false });

  const [scheduled, [unscheduled], [mine]] = useMemo(
    () =>
      data
        .filter((child) => child.id !== teacher?.id)
        .reduce(
          (
            prev: [ChildrenResponse[], ChildrenResponse[], ChildrenResponse[]],
            child
          ) => {
            if (isRelevantDate(child.schedule)) {
              const index = childId === child.id ? 2 : 0;
              prev[index].push(child);
            } else if (childId === child.id) {
              prev[1].push(child);
            }
            return prev;
          },
          [[], [], []]
        ),
    [childId, data, teacher?.id]
  );

  const onDeny = useCallback(
    () => setErrorMessage("לא נורא, אולי שבוע הבא... 😔"),
    []
  );

  const childName = useMemo(() => {
    if (childId === teacher?.id && teacher?.name) return teacher.name;
    const child = data.find((item) => item.id === childId);
    if (child) return `הורים של ${child.name}`;
    return "";
  }, [childId, data, teacher?.id, teacher?.name]);

  return (
    <AppContext.Provider value={{ childId, setChildId, teacher }}>
      {loading || !childId ? (
        <CircularProgress size={60} />
      ) : (
        <div className="main-wrapper">
          <div className="top-container">
            {childName && (
              <Typography variant="h6">שלום ל{childName} 👋</Typography>
            )}
            <ListTitle scheduled={scheduled} />
            <TeacherCard />
            {unscheduled && (
              <AddButton
                data={unscheduled}
                onUpdate={handleUpdateSchedule}
                onDeny={onDeny}
              />
            )}
            {childId === teacher?.id && teacher && (
              <AddButton
                data={teacher}
                onUpdate={handleUpdateSchedule}
                onDeny={onDeny}
              />
            )}
            {scheduled.length > 0 && (
              <Typography variant="body1" className="list-subtitle">
                מי נרשמו?
              </Typography>
            )}
          </div>
          <List className="children-list">
            {mine && (
              <ListItem
                key={mine.id}
                data={mine}
                onUpdate={handleUpdateSchedule}
              />
            )}
            {scheduled.map((child) => (
              <ListItem
                key={child.id}
                data={child}
                onUpdate={handleUpdateSchedule}
              />
            ))}
          </List>
          <AppFooter childName={childName} scheduled={scheduled} />
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
