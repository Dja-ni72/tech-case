import { Course } from "../models/course.model";

export async function fetchCourses(searchQuery = ''): Promise<Course[]> {
  const res = await fetch(`http://localhost:3000/api/courses?search=${encodeURIComponent(searchQuery)}`);
  return res.json();
}
