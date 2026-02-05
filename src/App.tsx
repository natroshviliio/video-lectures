import { useEffect, useState } from "react";

function App() {
    const [data, setData] = useState("");
    const base_url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(base_url + "/");
            const data = await response.json();
            console.log(data);

            setData(data);
        };

        fetchData();
    }, []);

    return <div>Hello world {data} </div>;
}

export default App;
