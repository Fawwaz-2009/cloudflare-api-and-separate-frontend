"use client";

import { useEffect, useState } from "react";

export default function ClientFetcherDemo() {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_SERVER_URL!)
      .then((res) => res.text())
      .then((data) => setData(data))
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {JSON.stringify(error)}</p>}
      {data && <p>{data}</p>}
    </div>
  );
}
