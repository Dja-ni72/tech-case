import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type Question = {
  _id: string;
  title: string;
};

type Course = {
  title: string;
  description: string;
  questions: Question[];
};

const CourseDetail = () => {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/code/${courseCode}`);
        if (!response.ok) throw new Error("Failed to fetch course details");
        const data: Course = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Failed to fetch course details", error);
      }
    };

    fetchCourse();
  }, [courseCode]);

  if (!course) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* Header Section */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <button onClick={() => navigate("/courses")} style={{ marginRight: "10px" }}>
          Go back to courses
        </button>
        <h1 style={{ margin: 0 }}>{course.title}</h1>
      </div>
      <hr />

      <h2>Questions</h2>
      <hr />

      {/* Questions Section */}
      {course.questions.length > 0 ? (
        <ol>
          {course.questions.map((question) => (
            <li key={question._id} style={{ marginBottom: "20px" }}>
              <div>{question.title}</div>
              <hr />
            </li>
          ))}
        </ol>
      ) : (
        <p>No questions available for this course.</p>
      )}
    </div>
  );
};

export default CourseDetail;
