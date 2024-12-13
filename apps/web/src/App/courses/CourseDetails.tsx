import { Alert } from "antd"; 
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Input, Button, List } from "antd";

type Choice = {
  text: string;
};

type Question = {
  _id: string;
  title: string;
  choices: Choice[];
};

type Course = {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
};

const CourseDetail = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); 

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/code/${courseCode}`);
        if (!response.ok) throw new Error("Failed to fetch course details");
        const data: Course = await response.json();
        setCourse(data);
      } catch (err) {
        console.error("Failed to fetch course details", err);
        setError("Failed to load course details. Please try again later.");
      }
    };

    fetchCourse();
  }, [courseCode]);

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleSave = async () => {
    if (!course || !selectedQuestion) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/courses/${course._id}/questions/${selectedQuestion._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: selectedQuestion.title,
            choices: selectedQuestion.choices,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update question");

      const updatedQuestion: Question = await response.json();

      // Update the course's questions in state
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              questions: prev.questions.map((q) =>
                q._id === updatedQuestion._id ? updatedQuestion : q
              ),
            }
          : null
      );
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to update question", err);
      setError("Failed to update the question. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (question: Question) => {
    if (!course) return;

    try {
      const response = await fetch(
        `/api/courses/${course._id}/questions/${question._id}/duplicate`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) throw new Error("Failed to duplicate question");

      const duplicatedQuestion: Question = await response.json();

      // Update the course's questions in state
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              questions: [...prev.questions, duplicatedQuestion],
            }
          : null
      );
    } catch (err) {
      console.error("Failed to duplicate question", err);
      setError("Failed to duplicate the question. Please try again later.");
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)} 
          style={{ marginBottom: "20px" }}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <button onClick={() => navigate("/courses")} style={{ marginRight: "10px" }}>
          Go back to courses
        </button>
        <h1 style={{ margin: 0 }}>{course.title}</h1>
      </div>
      <hr />

      <p>{course.description}</p>
      <h2>Questions</h2>
      <hr />

      {course.questions.length > 0 ? (
        <List
          bordered
          dataSource={course.questions}
          renderItem={(question) => (
            <List.Item
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span onClick={() => handleQuestionClick(question)} style={{ cursor: "pointer" }}>
                {question.title}
              </span>
              <Button onClick={() => handleDuplicate(question)}>Duplicate</Button>
            </List.Item>
          )}
        />
      ) : (
        <p>No questions available for this course.</p>
      )}

      {/* Edit Question Modal */}
      {selectedQuestion && (
        <Modal
          title="Edit Question"
          open={isModalOpen}
          onCancel={handleModalCancel}
          footer={[
            <Button key="cancel" onClick={handleModalCancel}>
              Cancel
            </Button>,
            <Button key="save" type="primary" onClick={handleSave} loading={loading}>
              Save
            </Button>,
          ]}
        >
          <div style={{ marginBottom: "10px" }}>
            <label>Question Title:</label>
            <Input
              value={selectedQuestion.title}
              onChange={(e) =>
                setSelectedQuestion((prev) => prev && { ...prev, title: e.target.value })
              }
            />
          </div>
          <div>
            <label>Choices:</label>
            {selectedQuestion.choices.map((choice, index) => (
              <Input
                key={index}
                value={choice.text}
                onChange={(e) =>
                  setSelectedQuestion((prev) =>
                    prev
                      ? {
                          ...prev,
                          choices: prev.choices.map((c, i) =>
                            i === index ? { ...c, text: e.target.value } : c
                          ),
                        }
                      : null
                  )
                }
                style={{ marginBottom: "5px" }}
              />
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CourseDetail;
