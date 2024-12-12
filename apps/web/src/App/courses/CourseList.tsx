import { Card, Table, Input } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchCourses } from '../../api-services/courses.api-service';
import { Course } from "../../models/course.model";
import { DataType } from "../../models/data-type.model";
import * as S from './CourseList.styles';

type CourseListItem = DataType<Pick<Course, 'code' | 'title' | 'description'>>;

const columns: ColumnsType<CourseListItem> = [
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
    render: (code: string) => <strong>{code}</strong>,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  }
];

function transformCoursesToDatasource(courses: Course[]): CourseListItem[] {
  return courses.map(course => ({
    key: course.code,
    code: course.code,
    title: course.title,
    description: course.description,
  }));
}

export const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesDataSource, setCoursesDataSource] = useState<CourseListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

  useEffect(() => {
    async function getCourses(query = '') {
      const coursesPayload = await fetchCourses(query); // Pass the query to the API service
      setCourses(coursesPayload);
    }
    getCourses(searchQuery);
  }, [searchQuery]); // Re-fetch courses when the search query changes

  useEffect(() => {
    setCoursesDataSource(transformCoursesToDatasource(courses));
  }, [courses]);

  function handleCourseClick(course: CourseListItem) {
    navigate(`./${course.code}`);
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value); // Update search query on every keystroke
  }

  return (
    <S.Wrapper>
      {/* Search Input for filtering courses */}
      <Input
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for a course by code or title"
      />

      <Card>
        <Table
          columns={columns}
          dataSource={coursesDataSource}
          onRow={course => ({
            onClick: () => handleCourseClick(course),
          })}
          scroll={{ y: '80vh' }}
        />
      </Card>
    </S.Wrapper>
  );
};
