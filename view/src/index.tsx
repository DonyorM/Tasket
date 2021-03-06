import "./Firebase";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Login from "./routes/Login";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import CreateGroup from "./routes/CreateGroup";
import ViewGroup from "./routes/ViewGroup";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Unsubscribe from "./routes/Unsubscribe";
import GroupHistoryView from "./routes/GroupHistoryView";

dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App />}>
          <Route path="" element={<Home />} />
          <Route path="create-group" element={<CreateGroup />} />
          <Route path="group/:groupId" element={<ViewGroup />} />
          <Route path="group/:groupId/history" element={<GroupHistoryView />} />
          <Route path="unsubscribe" element={<Unsubscribe />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
