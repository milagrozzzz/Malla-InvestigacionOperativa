document.addEventListener("DOMContentLoaded", () => {
  const cursos = Array.from(document.querySelectorAll(".curso"));
  const creditosSpan = document.getElementById("creditos");

  // Mapa rápido id -> elemento
  const porId = new Map(cursos.map(c => [c.dataset.id?.trim(), c]));

  // Dependencias inversas (quién depende de quién) para recalcular rápido
  const dependientes = new Map(); // id prereq -> [cursos que lo requieren]
  cursos.forEach(curso => {
    listaPrereqs(curso).forEach(pr => {
      if (!dependientes.has(pr)) dependientes.set(pr, []);
      dependientes.get(pr).push(curso);
    });
  });

  // ---- Persistencia ----
  const STORAGE_KEY = "mallaIO:aprobados";
  const guardados = cargaAprobados();
  guardados.forEach(id => {
    const el = porId.get(id);
    if (el) el.classList.add("completado");
  });

  // Estado inicial: bloquear/desbloquear y actualizar créditos
  evaluaBloqueosDeTodos();
  actualizaCreditos();

  // ---- Eventos de interacción ----
  cursos.forEach(curso => {
    // Click: marcar/desmarcar si está desbloqueado
    curso.addEventListener("click", () => {
      if (curso.classList.contains("locked")) return; // no permite click si está bloqueado

      curso.classList.toggle("completado");
      guardaAprobados();
      actualizaCreditos();

      // Re-evaluar bloqueos de cursos dependientes y, por simplicidad, de todos
      evaluaBloqueosDeTodos();
    });

    // Hover: resaltar PRERREQUISITOS
    curso.addEventListener("mouseenter", () => {
      listaPrereqs(curso).forEach(id => {
        const pr = porId.get(id);
        if (pr) pr.classList.add("resaltado");
      });
    });
    curso.addEventListener("mouseleave", () => {
      cursos.forEach(c => c.classList.remove("resaltado"));
    });

    // Tooltip con prereqs (útil)
    const prereqs = listaPrereqs(curso);
    if (prereqs.length) {
      curso.title = "Prerrequisitos: " + prereqs.join(", ");
    } else {
      curso.title = "Sin prerrequisitos";
    }
  });

  // ---- Funciones auxiliares ----

  function listaPrereqs(cursoEl){
    const raw = (cursoEl.dataset.prereq || "").trim();
    if (!raw) return [];
    // separa por coma y limpia espacios / saltos de línea
    return raw.split(",").map(s => s.replace(/\s+/g, "").trim()).filter(Boolean);
  }

  function estaAprobado(id){
    const el = porId.get(id);
    return !!el && el.classList.contains("completado");
  }

  function tieneTodosPrereqs(el){
    const prereqs = listaPrereqs(el);
    if (prereqs.length === 0) return true;
    return prereqs.every(estaAprobado);
  }

  function evaluaBloqueosDeTodos(){
    cursos.forEach(el => {
      if (tieneTodosPrereqs(el)) {
        el.classList.remove("locked");
        el.setAttribute("tabindex", "0");
      } else {
        el.classList.add("locked");
        el.removeAttribute("tabindex");
      }
    });
  }

  function actualizaCreditos(){
    const total = cursos.reduce((acc, el) => {
      if (el.classList.contains("completado")) {
        const c = parseInt(el.dataset.creditos || "0", 10);
        return acc + (isNaN(c) ? 0 : c);
      }
      return acc;
    }, 0);
    if (creditosSpan) creditosSpan.textContent = String(total);
  }

  function guardaAprobados(){
    const aprobados = cursos
      .filter(c => c.classList.contains("completado"))
      .map(c => c.dataset.id?.trim())
      .filter(Boolean);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(aprobados));
  }

  function cargaAprobados(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    }catch{
      return [];
    }
  }
});
