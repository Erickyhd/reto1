import { useEffect, useState } from "react";
import { datos } from "./data/datos";
import { FaEdit, FaRegTrashAlt, FaCheck, FaBackward } from "react-icons/fa";

function App() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [elementosPorPagina, setElementosPorPagina] = useState(10);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [datosProducto, setDatosProducto] = useState(datos);
  const [modal, setModal] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 500);
  }, []);

  const datosFiltrados = datosProducto.filter((item) =>
    item.producto.toLowerCase().includes(busqueda.toLowerCase())
  );
  const totalPaginas = Math.ceil(datosFiltrados.length / elementosPorPagina);
  const inicio = (paginaActual - 1) * elementosPorPagina;
  const fin = inicio + elementosPorPagina;
  const datosPaginados = datosFiltrados.slice(inicio, fin);

  const abrirModal = (prod) => {
    setProductoSeleccionado(prod);
    setModal(true);
  };

  const editar = (prodEditado) => {
    setDatosProducto((prev) =>
      prev.map((item) =>
        item.codDig === prodEditado.codDig ? prodEditado : item
      )
    );
    setModal(false);
  };

  const eliminar = (codDig) => {
    if (confirm("¿Seguro que deseas eliminar?")) {
      setDatosProducto((prev) => prev.filter((item) => item.codDig !== codDig));
    }
  };

  return (
    <div className="p-4 space-y-6 font-serif bg-gradient-to-b from-blue-50 via-white to-blue-100 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
          className="border rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
        <select
          value={elementosPorPagina}
          onChange={(e) => {
            setElementosPorPagina(+e.target.value);
            setPaginaActual(1);
          }}
          className="border rounded p-2 m-auto focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        >
          {[10, 15, 20].map((n) => (
            <option key={n} value={n}>
              Mostrar {n}
            </option>
          ))}
        </select>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {datosPaginados.map((item, idx) => (
          <article
            key={item.codDig}
            style={{ transitionDelay: `${idx * 100}ms` }}
            className={`bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl shadow-md p-4 flex flex-col justify-between transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-xl
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div>
              <h3 className="font-bold mb-2 text-lg">{item.producto}</h3>
              <p><strong>Código:</strong> {item.codDig}</p>
              <p><strong>Laboratorio:</strong> {item.laboratorio}</p>
              <p><strong>Stock actual:</strong> {item.stockActual}</p>
              <p><strong>Stock mínimo:</strong> {item.stockMinimo}</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
                onClick={() => abrirModal(item)}
              >
                <FaEdit />
              </button>
              <button
                className="bg-red-400 text-white p-2 rounded hover:bg-red-700 hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
                onClick={() => eliminar(item.codDig)}
              >
                <FaRegTrashAlt />
              </button>
            </div>
          </article>
        ))}
      </section>

      <p className="text-center">
        Mostrando del {inicio + 1} al {Math.min(fin, datosFiltrados.length)} de {datosFiltrados.length} registros
      </p>

      <div className="flex justify-center gap-1 bg-white/70 backdrop-blur-sm rounded-lg p-2 shadow-md">
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          {"<<"}
        </button>
        {[...Array(totalPaginas)].map((_, i) => {
          const num = i + 1;
          return (
            <button
              key={num}
              onClick={() => setPaginaActual(num)}
              className={`px-3 py-1 border rounded ${
                paginaActual === num
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-200"
              }`}
            >
              {num}
            </button>
          );
        })}
        <button
          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          {">>"}
        </button>
      </div>

      {modal && productoSeleccionado && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md transform transition-all duration-300 scale-100 hover:scale-[1.01]">
            <h2 className="text-xl font-bold mb-4 text-center">Editar Producto</h2>
            {["producto", "laboratorio"].map((field) => (
              <input
                key={field}
                type="text"
                value={productoSeleccionado[field]}
                onChange={(e) =>
                  setProductoSeleccionado((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
                className="w-full border rounded p-2 mb-3"
              />
            ))}
            {["stockActual", "stockMinimo"].map((field) => (
              <input
                key={field}
                type="number"
                value={productoSeleccionado[field]}
                onChange={(e) =>
                  setProductoSeleccionado((prev) => ({
                    ...prev,
                    [field]: +e.target.value,
                  }))
                }
                className="w-full border rounded p-2 mb-3"
              />
            ))}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setModal(false)}
                className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300 flex items-center gap-1 hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <FaBackward /> Cancelar
              </button>
              <button
                onClick={() => editar(productoSeleccionado)}
                className="px-4 py-2 border rounded bg-green-200 hover:bg-green-300 flex items-center gap-1 hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <FaCheck /> Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
