const getAvailableCourses = (
  offeredCourses: any,
  studentCompletedCourses: any,
  studentCurrentSemesterTakenCourses: any
) => {
  //   console.log(
  //     'getAvailableCourses',
  //     offeredCourse,
  //     studentCompletedCourses,
  //     studentCurrentSemesterTakenCourses
  //   );

  const completedCourseIds = studentCompletedCourses.map(
    (course: any) => course.courseId
  );

  //   console.log(completedCourseIds);

  const availableCoursesList = offeredCourses
    .filter(
      (offeredCourse: any) =>
        !completedCourseIds.includes(offeredCourse.courseId)
    )
    .filter((course: any) => {
      const prerequisites = course.course.prerequisite;
      if (prerequisites.length === 0) {
        return true;
      } else {
        const prerequisiteIds = prerequisites.map(
          (prerequisite: any) => prerequisite.prerequisiteId
        );

        return prerequisiteIds.every((id: string) =>
          completedCourseIds.includes(id)
        );
      }
    })
    .map((course: any) => {
      const alreadyTakenCourse = studentCurrentSemesterTakenCourses.find(
        (c: any) => c.offeredCourseId === course.id
      );

      if (alreadyTakenCourse) {
        course.offeredCourseSections.map((section: any) => {
          if (section.id === alreadyTakenCourse.offeredCourseSectionId) {
            section.isTaken = true;
          } else {
            section.isTaken = false;
          }
        });

        return {
          ...course,
          isTaken: true,
        };
      } else {
        course.offeredCourseSections.map((section: any) => {
          section.isTaken = false;
        });

        return {
          ...course,
          isTaken: false,
        };
      }
    });

  //   console.log(availableCoursesList);

  return availableCoursesList;
};

export const SemesterRegistrationUtils = {
  getAvailableCourses,
};
