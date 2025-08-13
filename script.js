document.addEventListener("DOMContentLoaded", () => {
    const courses = document.querySelectorAll(".course");
    let totalCredits = 0;

    // Mostrar créditos iniciales
    const creditCounter = document.getElementById("credit-counter");
    creditCounter.textContent = `Créditos totales: ${totalCredits}`;

    courses.forEach(course => {
        course.addEventListener("click", () => {
            // Alternar estado completado
            course.classList.toggle("completed");
            const credits = parseInt(course.dataset.credits);

            if (course.classList.contains("completed")) {
                totalCredits += credits;
            } else {
                totalCredits -= credits;
            }

            creditCounter.textContent = `Créditos totales: ${totalCredits}`;
        });

        // Resaltar prerrequisitos al pasar el mouse
        course.addEventListener("mouseenter", () => {
            const prereqs = course.dataset.prereqs ? course.dataset.prereqs.split(",") : [];
            prereqs.forEach(prereqId => {
                const prereqCourse = document.getElementById(prereqId.trim());
                if (prereqCourse) {
                    prereqCourse.classList.add("highlight");
                }
            });
        });

        course.addEventListener("mouseleave", () => {
            document.querySelectorAll(".highlight").forEach(el => {
                el.classList.remove("highlight");
            });
        });
    });
});
