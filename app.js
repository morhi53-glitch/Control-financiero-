// --- LÓGICA DE NOTAS (localStorage) ---
const input = document.getElementById("nota-input");
const addBtn = document.getElementById("add-btn");
const listaNotas = document.getElementById("lista-notas");
const statusEl = document.getElementById("status");

function cargarNotas() {
  const data = localStorage.getItem("notas");
  return data ? JSON.parse(data) : [];
}

function guardarNotas(notas) {
  localStorage.setItem("notas", JSON.stringify(notas));
}

function renderNotas() {
  const notas = cargarNotas();
  listaNotas.innerHTML = "";

  notas.forEach((texto, index) => {
    const li = document.createElement("li");
    li.textContent = texto;

    const btnBorrar = document.createElement("button");
    btnBorrar.textContent = "Borrar";
    btnBorrar.addEventListener("click", () => {
      const nuevas = cargarNotas().filter((_, i) => i !== index);
      guardarNotas(nuevas);
      renderNotas();
    });

    li.appendChild(btnBorrar);
    listaNotas.appendChild(li);
  });
}

addBtn.addEventListener("click", () => {
  const texto = input.value.trim();
  if (!texto) return;

  const notas = cargarNotas();
  notas.push(texto);
  guardarNotas(notas);
  input.value = "";
  renderNotas();
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addBtn.click();
});

renderNotas();

// --- REGISTRO DEL SERVICE WORKER ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => {
        statusEl.textContent = "App lista para usarse offline ✅";
      })
      .catch(() => {
        statusEl.textContent = "No se pudo registrar el Service Worker.";
      });
  });
} else {
  statusEl.textContent = "Este navegador no soporta Service Workers.";
}
