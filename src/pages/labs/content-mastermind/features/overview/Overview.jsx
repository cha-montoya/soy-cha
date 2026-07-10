import useContent from "../../hooks/useContent";

export default function Overview() {
  const { contents, loading, error } = useContent();

  if (loading) {
    return <p>Cargando contenidos...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Overview</h2>

      <p className="mt-4">
        Contenidos encontrados: <strong>{contents.length}</strong>
      </p>

      <pre className="mt-6 text-xs bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(contents, null, 2)}
      </pre>
    </div>
  );
}