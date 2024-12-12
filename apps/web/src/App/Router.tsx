import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";

import App from "./App.tsx";
import { CourseList } from "./courses/CourseList.tsx";
import CourseDetail from "./courses/CourseDetails.tsx";

export const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} path="/">
      {/* Route for the list of courses */}
      <Route element={<CourseList />} path="courses" />

      {/* Route for course details by code */}
      <Route element={<CourseDetail />} path="courses/:courseCode" />

      {/* Default redirect to courses */}
      <Route element={<Navigate replace={true} to="/courses" />} path="/" />
    </Route>
  )
);
