document.addEventListener("DOMContentLoaded", () => {
    const courses = document.querySelectorAll(".course");
    const creditDisplay = document.getElementById("total-credits");
    let totalCredits = 0;

    // Suma de créditos de los cursos ya completados
    courses.forEach(course => {
        if (course.classList.contains("completed")) {
            totalCredits += parseInt(course.dataset.credits || "0");
        }
    });
    creditDisplay.textContent = totalCredits;

    // Hover para resaltar prerrequisitos
    courses.forEach(course => {
        course.addEventListener("mouseenter", () => {
            const prereqText = course.dataset.prereq;
            if (prereqText) {
                const prereqList = prereqText.split(",");
                prereqList.forEach(prereq => {
                    courses.forEach(c => {
                        if (c.dataset.name.trim() === prereq.trim()) {
                            c.classList.add("highlight");
                        }
                    });
                });
            }
        });

        course.addEventListener("mouseleave", () => {
            courses.forEach(c => c.classList.remove("highlight"));
        });

        // Clic para marcar como completado y sumar créditos
        course.addEventListener("click", () => {
            if (!course.classList.contains("completed")) {
                course.classList.add("completed");
                totalCredits += parseInt(course.dataset.credits || "0");
            } else {
                course.classList.remove("completed");
                totalCredits -= parseInt(course.dataset.credits || "0");
            }
            creditDisplay.textContent = totalCredits;
        });
    });
});
