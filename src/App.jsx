import { useState } from "react";
import { datos } from "./data/datos";
import { useRef } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
function App() {
  const columnas = [
    "codDig",
    "Producto",
    "Laboratorio",
    "StockActual",
    "StockMinimo",
    "Acciones",
  ];

  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [elementosPorPagina, setElementosPorPagina] = useState(10);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const tablaRef = useRef(null);

  const datosFiltrados = datos.filter((item) =>
    item.producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  const inicio = (paginaActual - 1) * elementosPorPagina;
  const fin = inicio + elementosPorPagina;
  const datosPaginados = datosFiltrados.slice(inicio, fin);
  const totalPaginas = Math.ceil(datosFiltrados.length / elementosPorPagina);
  const paginasVisibles = [
    paginaActual,
    paginaActual + 1,
    paginaActual + 2,
  ].filter((p) => p <= totalPaginas);

  const datosParaCSV = datosFiltrados.map((item) => ({
    codDig: item.codDig,
    producto: item.producto,
    laboratorio: item.laboratorio,
    stockActual: item.stockActual,
    stockMinimo: item.stockMinimo,
  }));

  const exportarPDF = () => {
    const doc = new jsPDF();

    // Títulos de las columnas
    const columnas = [
      "Código",
      "Producto",
      "Laboratorio",
      "Stock Actual",
      "Stock Mínimo",
    ];

    // Datos de la tabla
    const filas = datos.map((item) => [
      item.codDig,
      item.producto,
      item.laboratorio,
      item.stockActual,
      item.stockMinimo,
    ]);

    // Generar la tabla en el PDF
    autoTable(doc, {
      head: [columnas],
      body: filas,
      styles: { fontSize: 8 },
    });

    doc.save("reporte_productos.pdf");
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center py-2 w-full font-serif">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="bg-white outline-none border p-1 rounded-lg w-1/3"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="flex justify-center mt-4 ">
          <button
            className={`text-black border rounded cursor-pointer ${
              paginaActual === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600 hover:text-white"
            }`}
            onClick={() => setPaginaActual(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            {"<<"}
          </button>

          {paginasVisibles.map((num) => (
            <button
              key={num}
              className={`px-2 py-1 w-[25px] rounded cursor-pointer border ${
                paginaActual === num
                  ? "text-white bg-blue-600 border-none"
                  : " text-blue-700 hover:text-white hover:bg-blue-600"
              }`}
              onClick={() => setPaginaActual(num)}
            >
              {num}
            </button>
          ))}

          <button
            className={`text-black border rounded cursor-pointer ${
              paginaActual === totalPaginas
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600 hover:text-white"
            }`}
            onClick={() => setPaginaActual(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            {">>"}
          </button>
        </div>

        <button
          className={`md:hidden bg-blue-500 text-white px-3 py-1 rounded-lg hover:cursor-pointer ${
            menuAbierto ? "bg-red-700" : "hover:bg-blue-700"
          }`}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          {menuAbierto ? "✕" : "⁞"}
        </button>

        {menuAbierto && (
          <aside className="absolute top-16 right-4 rounded-lg p-2 md:hidden bg-white flex flex-col">
            <DownloadTableExcel
              filename="reporte_productos"
              sheet="Productos"
              currentTableRef={tablaRef.current}
            >
              <button className="bg-blue-500 text-white rounded-lg px-3 py-1 m-1 hover:bg-blue-700">
                Excel productos
              </button>
            </DownloadTableExcel>

            <CSVLink
              data={datosParaCSV}
              filename={"productos.csv"}
              className="bg-blue-500 text-white rounded-lg px-3 py-1 m-1 cursor-pointer hover:bg-blue-700"
            >
              CSV
            </CSVLink>

            <button
              className="bg-blue-500 text-white rounded-lg px-3 py-1 m-1 cursor-pointer hover:bg-blue-700"
              onClick={exportarPDF}
            >
              PDF
            </button>
          </aside>
        )}

        <section className="hidden md:flex gap-2 font-bold">
          <DownloadTableExcel
            filename="reporte_productos"
            sheet="Productos"
            currentTableRef={tablaRef.current}
          >
            <button className="bg-blue-500 text-white rounded-lg px-3 py-1 hover:bg-blue-700">
              Excel productos
            </button>
          </DownloadTableExcel>
          <CSVLink
            data={datosParaCSV}
            filename={"productos.csv"}
            className="bg-blue-500 text-white rounded-lg px-3 py-1 cursor-pointer hover:bg-blue-700"
          >
            CSV
          </CSVLink>
          <button
            className="bg-blue-500 text-white rounded-lg px-3 py-1 cursor-pointer hover:bg-blue-700"
            onClick={exportarPDF}
          >
            PDF
          </button>
        </section>
      </div>

      <div className="flex justify-end">
        <select
          className="bg-white border p-1 mb-4 rounded-lg cursor-pointer"
          value={elementosPorPagina}
          onChange={(e) => {
            setElementosPorPagina(parseInt(e.target.value));
            setPaginaActual(1);
          }}
        >
          <option value={10}>Mostrar 10</option>
          <option value={15}>Mostrar 15</option>
          <option value={20}>Mostrar 20</option>
        </select>
      </div>
      <div className="max-w-full overflow-x-auto mb-2">
        <table
          ref={tablaRef}
          className="w-full table-auto border-collapse border border-gray-300"
        >
          <thead>
            <tr className="bg-blue-500 text-white font-serif">
              {columnas.map((columna) => (
                <th key={columna} className="px-4 py-2 text-sm">
                  {columna}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datosPaginados.map((item) => (
              <tr
                key={item.codDig}
                className="border-t text-sm md:text-base hover:bg-gray-200 transition-all duration-300 font-serif"
              >
                <td className="px-4 py-2 w-1/7">{item.codDig}</td>
                <td className="px-4 py-2">{item.producto}</td>
                <td className="px-4 py-2">{item.laboratorio}</td>
                <td className="px-4 py-2">{item.stockActual}</td>
                <td className="px-4 py-2">{item.stockMinimo}</td>
                <td className="px-4 py-2 flex">
                  <button className="rounded-lg px-2 py-1 cursor-pointer hover:bg-gray-400">
                    🖋️
                  </button>
                  <p>Armar kit ⁕</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-serif">{`Mostrando registros del ${
        inicio + 1
      } al ${fin} de un total de ${datos.length} registros`}</p>
    </div>
  );
}

export default App;
