let creditosTotales = 0;

document.querySelectorAll(".curso").forEach(curso => {
    // Clic para marcar/desmarcar como aprobado
    curso.addEventListener("click", () => {
        const creditos = parseInt(curso.getAttribute("data-creditos"));
        if (curso.classList.contains("aprobado")) {
            curso.classList.remove("aprobado");
            creditosTotales -= creditos;
        } else {
            curso.classList.add("aprobado");
            creditosTotales += creditos;
        }
        document.getElementById("creditos").textContent = creditosTotales;
    });

    // Resaltar prerequisitos al pasar el mouse
    curso.addEventListener("mouseenter", () => {
        const prereq = curso.getAttribute("data-prereq");
        if (prereq) {
            prereq.split(",").forEach(id => {
                const cursoReq = document.querySelector(`.curso[data-id="${id}"]`);
                if (cursoReq) cursoReq.classList.add("prereq-resaltado");
            });
        }
    });

    // Quitar resaltado al salir
    curso.addEventListener("mouseleave", () => {
        document.querySelectorAll(".curso").forEach(c => c.classList.remove("prereq-resaltado"));
    });
});
