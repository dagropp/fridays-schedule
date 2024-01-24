import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChildrenResponse,
  getChildren,
  getNextFriday,
  isRelevantDate,
} from "./api";
import {
  AddButton,
  AppFooter,
  ListItem,
  ListTitle,
  MayaCard,
  ParentDialog,
} from "./components";
import { AppContext, ChildId } from "./context";
import { storage } from "./storage";
import {
  Alert,
  CircularProgress,
  IconButton,
  List,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import "./App.css";
import { SyncOutlined } from "@mui/icons-material";
import { clsx } from "./general";

function App() {
  const [data, setData] = useState<ChildrenResponse[]>([]);
  const [childId, setChildId] = useState<ChildId>(storage.get());
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [innerLoading, setInnerLoading] = useState(false);

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
    setInnerLoading(true);
    try {
      const response = await getChildren();
      setData(response);
    } finally {
      setLoading(false);
      setInnerLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (childId) storage.set(childId);
    else storage.reset();
  }, [childId]);

  const [scheduled, [unscheduled], [mine]] = useMemo(
    () =>
      data
        .filter((child) => child.id !== -1)
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
    [childId, data]
  );

  const childName = useMemo(() => {
    if (childId === -1) return "מאיה הגננת";
    const child = data.find((item) => item.id === childId);
    if (child) return `הורים של ${child.name}`;
    return "";
  }, [childId, data]);

  const onDeny = useCallback(
    () => setErrorMessage("לא נורא, אולי שבוע הבא... 😔"),
    []
  );

  const maya = useMemo(() => data.find((item) => item.id === -1), [data]);

  return (
    <AppContext.Provider value={{ childId, setChildId }}>
      {loading || !childId ? (
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
              <AddButton
                data={unscheduled}
                onUpdate={handleUpdateSchedule}
                onDeny={onDeny}
              />
            )}
            {childId === -1 ? (
              <AddButton
                data={maya!}
                onUpdate={handleUpdateSchedule}
                onDeny={onDeny}
              />
            ) : (
              <></>
            )}
            {scheduled.length > 0 && (
              <Typography variant="body1" className="list-subtitle">
                מי נרשמו?
                <Tooltip title="עדכון הרשימה">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={fetchChildren}
                  >
                    <SyncOutlined
                      fontSize="small"
                      className={clsx(
                        "refresh-icon",
                        innerLoading && "loading"
                      )}
                    />
                  </IconButton>
                </Tooltip>
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
          <AppFooter maya={maya} childName={childName} scheduled={scheduled} />
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
