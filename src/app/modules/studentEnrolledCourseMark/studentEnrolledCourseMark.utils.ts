import { Course, StudentEnrolledCourse } from '@prisma/client';

const getGradeFromMarks = (marks: number) => {
  let result = {
    grade: '',
    point: 0,
  };

  if (marks >= 0 && marks < 40) {
    result = {
      grade: 'F',
      point: 0,
    };
  } else if (marks >= 40 && marks < 50) {
    result = {
      grade: 'D',
      point: 2.0,
    };
  } else if (marks >= 50 && marks < 60) {
    result = {
      grade: 'C',
      point: 2.5,
    };
  } else if (marks >= 60 && marks < 70) {
    result = {
      grade: 'B',
      point: 3.0,
    };
  } else if (marks >= 70 && marks < 80) {
    result = {
      grade: 'A',
      point: 3.5,
    };
  } else if (marks >= 80 && marks <= 100) {
    result = {
      grade: 'A+',
      point: 4.0,
    };
  }

  return result;
};

const calcCGPAandGrade = (
  payload: (StudentEnrolledCourse & { course: Course })[]
) => {
  //   console.log(payload);

  if (payload.length === 0) {
    return {
      totalCompletedCredit: 0,
      cgpa: 0,
    };
  }

  let totalCredit = 0;
  let totalCGPA = 0;
  for (const grade of payload) {
    // console.log(grade);
    totalCGPA += grade.point || 0;
    totalCredit += grade.course.credits || 0;
  }

  // console.log({ totalCredit, totalCGPA });

  const avgCGPA = Number((totalCGPA / payload.length).toFixed(2));

  // console.log({ avgCGPA });

  return {
    totalCompletedCredit: totalCredit,
    cgpa: avgCGPA,
  };
};

export const StudentEnrolledCourseMarkUtils = {
  getGradeFromMarks,
  calcCGPAandGrade,
};
